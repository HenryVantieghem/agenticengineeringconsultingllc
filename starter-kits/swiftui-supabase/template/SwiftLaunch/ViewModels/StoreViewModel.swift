import Foundation
import StoreKit

@Observable
final class StoreViewModel {
    var products: [Product] { storeService.products }
    var isPremium: Bool { storeService.isPremium }
    var isLoading: Bool { storeService.isLoading }
    var isPurchasing = false
    var error: String?
    var showPaywall = false
    var purchaseSuccessful = false

    private let storeService = StoreKitService.shared

    var monthlyProduct: Product? { storeService.monthlyProduct }
    var yearlyProduct: Product? { storeService.yearlyProduct }
    var lifetimeProduct: Product? { storeService.lifetimeProduct }

    var yearlySavingsPercent: Int {
        guard let monthly = monthlyProduct, let yearly = yearlyProduct else { return 0 }
        let monthlyAnnual = monthly.price * 12
        let savings = (monthlyAnnual - yearly.price) / monthlyAnnual * 100
        return Int(savings)
    }

    // MARK: - Load

    func loadProducts() async {
        await storeService.loadProducts()
    }

    // MARK: - Purchase

    func purchase(_ product: Product) async {
        isPurchasing = true
        error = nil

        do {
            if let transaction = try await storeService.purchase(product) {
                await syncWithSupabase(transaction: transaction)
                await MainActor.run {
                    self.purchaseSuccessful = true
                    self.isPurchasing = false
                }
            } else {
                await MainActor.run {
                    self.isPurchasing = false
                }
            }
        } catch {
            await MainActor.run {
                self.error = "Purchase failed. Please try again."
                self.isPurchasing = false
            }
        }
    }

    // MARK: - Restore

    func restorePurchases() async {
        isPurchasing = true
        error = nil

        do {
            try await storeService.restorePurchases()
            await MainActor.run {
                if self.isPremium {
                    self.purchaseSuccessful = true
                } else {
                    self.error = "No previous purchases found."
                }
                self.isPurchasing = false
            }
        } catch {
            await MainActor.run {
                self.error = "Failed to restore purchases."
                self.isPurchasing = false
            }
        }
    }

    // MARK: - Subscription Info

    func subscriptionExpirationDate() async -> Date? {
        await storeService.subscriptionExpirationDate()
    }

    func subscriptionStatusText() async -> String {
        if storeService.hasLifetimeAccess {
            return "Lifetime Access"
        }

        if let status = await storeService.subscriptionStatus() {
            switch status.state {
            case .subscribed:
                return "Active"
            case .inGracePeriod:
                return "Grace Period"
            case .inBillingRetryPeriod:
                return "Billing Issue"
            case .revoked:
                return "Revoked"
            case .expired:
                return "Expired"
            default:
                return "Unknown"
            }
        }

        return "Free"
    }

    // MARK: - Sync with Supabase

    private func syncWithSupabase(transaction: Transaction) async {
        guard let userId = await SupabaseService.shared.currentUserID else { return }

        do {
            try await SupabaseService.shared.client.from("subscriptions")
                .upsert(
                    [
                        "user_id": userId.uuidString,
                        "product_id": transaction.productID,
                        "original_transaction_id": String(transaction.originalID),
                        "environment": transaction.environment.rawValue,
                        "updated_at": ISO8601DateFormatter().string(from: Date())
                    ],
                    onConflict: "user_id"
                )
                .execute()
        } catch {
            print("[SwiftLaunch] Failed to sync subscription: \(error.localizedDescription)")
        }
    }
}
