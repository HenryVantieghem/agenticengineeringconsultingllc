import Foundation
import StoreKit

@Observable
final class StoreKitService {
    static let shared = StoreKitService()

    private(set) var products: [Product] = []
    private(set) var purchasedProductIDs: Set<String> = []
    private(set) var isLoading = false

    private var transactionListener: Task<Void, Error>?

    var hasActiveSubscription: Bool {
        !purchasedProductIDs.intersection(
            [Config.StoreKit.monthlyProductID, Config.StoreKit.yearlyProductID]
        ).isEmpty
    }

    var hasLifetimeAccess: Bool {
        purchasedProductIDs.contains(Config.StoreKit.lifetimeProductID)
    }

    var isPremium: Bool {
        hasActiveSubscription || hasLifetimeAccess
    }

    var monthlyProduct: Product? {
        products.first { $0.id == Config.StoreKit.monthlyProductID }
    }

    var yearlyProduct: Product? {
        products.first { $0.id == Config.StoreKit.yearlyProductID }
    }

    var lifetimeProduct: Product? {
        products.first { $0.id == Config.StoreKit.lifetimeProductID }
    }

    private init() {
        transactionListener = listenForTransactions()
    }

    deinit {
        transactionListener?.cancel()
    }

    // MARK: - Load Products

    func loadProducts() async {
        guard products.isEmpty else { return }
        isLoading = true
        defer { isLoading = false }

        do {
            let storeProducts = try await Product.products(for: Config.StoreKit.allProductIDs)
            products = storeProducts.sorted { $0.price < $1.price }
            await updatePurchasedProducts()
        } catch {
            print("[SwiftLaunch] Failed to load products: \(error.localizedDescription)")
        }
    }

    // MARK: - Purchase

    func purchase(_ product: Product) async throws -> Transaction? {
        let result = try await product.purchase()

        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await updatePurchasedProducts()
            await transaction.finish()
            return transaction

        case .userCancelled:
            return nil

        case .pending:
            return nil

        @unknown default:
            return nil
        }
    }

    // MARK: - Restore Purchases

    func restorePurchases() async throws {
        try await AppStore.sync()
        await updatePurchasedProducts()
    }

    // MARK: - Subscription Status

    func subscriptionStatus() async -> Product.SubscriptionInfo.Status? {
        guard let product = monthlyProduct ?? yearlyProduct else { return nil }
        guard let statuses = try? await product.subscription?.status else { return nil }
        return statuses.first { $0.state == .subscribed || $0.state == .inGracePeriod }
    }

    func subscriptionExpirationDate() async -> Date? {
        guard let status = await subscriptionStatus() else { return nil }
        guard case .verified(let renewalInfo) = status.transaction else { return nil }
        return renewalInfo.expirationDate
    }

    // MARK: - Private

    private func listenForTransactions() -> Task<Void, Error> {
        Task.detached { [weak self] in
            for await result in Transaction.updates {
                guard let self else { return }
                do {
                    let transaction = try self.checkVerified(result)
                    await self.updatePurchasedProducts()
                    await transaction.finish()
                } catch {
                    print("[SwiftLaunch] Transaction verification failed: \(error.localizedDescription)")
                }
            }
        }
    }

    private func updatePurchasedProducts() async {
        var purchased: Set<String> = []

        for await result in Transaction.currentEntitlements {
            if let transaction = try? checkVerified(result) {
                purchased.insert(transaction.productID)
            }
        }

        purchasedProductIDs = purchased
    }

    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            throw error
        case .verified(let item):
            return item
        }
    }
}
