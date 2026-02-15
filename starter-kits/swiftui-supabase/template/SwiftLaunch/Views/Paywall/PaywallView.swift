import SwiftUI
import StoreKit

struct PaywallView: View {
    @Environment(StoreViewModel.self) private var storeViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var selectedProduct: Product?

    private let features: [PaywallFeature] = [
        PaywallFeature(icon: "infinity", title: "Unlimited Posts", description: "Create as many posts as you want"),
        PaywallFeature(icon: "bell.badge.fill", title: "Priority Notifications", description: "Never miss an important update"),
        PaywallFeature(icon: "sparkles", title: "Exclusive Content", description: "Access premium-only features"),
        PaywallFeature(icon: "person.2.fill", title: "Advanced Analytics", description: "Detailed insights on your content")
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing.xl) {
                    headerSection
                    featuresSection
                    plansSection
                    purchaseButton
                    restoreAndTerms
                }
                .padding(.horizontal, Theme.Spacing.lg)
                .padding(.vertical, Theme.Spacing.lg)
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.secondary)
                    }
                    .accessibilityLabel("Close paywall")
                }
            }
            .task {
                await storeViewModel.loadProducts()
                selectedProduct = storeViewModel.yearlyProduct ?? storeViewModel.monthlyProduct
            }
            .onChange(of: storeViewModel.purchaseSuccessful) { _, success in
                if success { dismiss() }
            }
        }
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(spacing: Theme.Spacing.md) {
            Image(systemName: "crown.fill")
                .font(.system(size: 56))
                .foregroundStyle(.yellow.gradient)
                .accessibilityHidden(true)

            Text("Go Premium")
                .font(Theme.Typography.largeTitle)
                .fontWeight(.bold)

            Text("Unlock all features and take your experience to the next level.")
                .font(Theme.Typography.body)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
    }

    // MARK: - Features

    private var featuresSection: some View {
        VStack(spacing: Theme.Spacing.md) {
            ForEach(features, id: \.title) { feature in
                HStack(spacing: Theme.Spacing.md) {
                    Image(systemName: feature.icon)
                        .font(.title3)
                        .foregroundStyle(Theme.Colors.primary)
                        .frame(width: 32)
                        .accessibilityHidden(true)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(feature.title)
                            .font(Theme.Typography.subheadline)
                            .fontWeight(.semibold)
                        Text(feature.description)
                            .font(Theme.Typography.footnote)
                            .foregroundStyle(.secondary)
                    }

                    Spacer()
                }
                .accessibilityElement(children: .combine)
                .accessibilityLabel("\(feature.title): \(feature.description)")
            }
        }
        .padding(Theme.Spacing.md)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.lg))
    }

    // MARK: - Plans

    private var plansSection: some View {
        VStack(spacing: Theme.Spacing.sm) {
            if let monthly = storeViewModel.monthlyProduct {
                planCard(
                    product: monthly,
                    title: "Monthly",
                    subtitle: monthly.displayPrice + "/month",
                    badge: nil,
                    isSelected: selectedProduct?.id == monthly.id
                )
            }

            if let yearly = storeViewModel.yearlyProduct {
                planCard(
                    product: yearly,
                    title: "Yearly",
                    subtitle: yearly.displayPrice + "/year",
                    badge: storeViewModel.yearlySavingsPercent > 0 ? "Save \(storeViewModel.yearlySavingsPercent)%" : nil,
                    isSelected: selectedProduct?.id == yearly.id
                )
            }

            if let lifetime = storeViewModel.lifetimeProduct {
                planCard(
                    product: lifetime,
                    title: "Lifetime",
                    subtitle: lifetime.displayPrice + " once",
                    badge: "Best Value",
                    isSelected: selectedProduct?.id == lifetime.id
                )
            }
        }
    }

    private func planCard(
        product: Product,
        title: String,
        subtitle: String,
        badge: String?,
        isSelected: Bool
    ) -> some View {
        Button {
            withAnimation(.spring(response: 0.3)) {
                selectedProduct = product
            }
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: Theme.Spacing.sm) {
                        Text(title)
                            .font(Theme.Typography.subheadline)
                            .fontWeight(.semibold)

                        if let badge {
                            Text(badge)
                                .font(Theme.Typography.caption)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(Theme.Colors.primary.gradient)
                                .clipShape(Capsule())
                        }
                    }

                    Text(subtitle)
                        .font(Theme.Typography.footnote)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .font(.title2)
                    .foregroundStyle(isSelected ? Theme.Colors.primary : .secondary)
            }
            .padding(Theme.Spacing.md)
            .background(isSelected ? Theme.Colors.primary.opacity(0.1) : Color.clear)
            .overlay {
                RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                    .stroke(isSelected ? Theme.Colors.primary : .secondary.opacity(0.3), lineWidth: isSelected ? 2 : 1)
            }
            .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.md))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(title) plan, \(subtitle)\(badge.map { ", \($0)" } ?? "")")
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }

    // MARK: - Purchase Button

    private var purchaseButton: some View {
        VStack(spacing: Theme.Spacing.sm) {
            if let error = storeViewModel.error {
                Text(error)
                    .font(Theme.Typography.footnote)
                    .foregroundStyle(.red)
                    .multilineTextAlignment(.center)
            }

            PrimaryButton(
                title: "Subscribe Now",
                isLoading: storeViewModel.isPurchasing
            ) {
                guard let product = selectedProduct else { return }
                Task { await storeViewModel.purchase(product) }
            }
            .disabled(selectedProduct == nil)
            .accessibilityLabel("Subscribe to \(selectedProduct?.displayName ?? "selected plan")")
        }
    }

    // MARK: - Restore & Terms

    private var restoreAndTerms: some View {
        VStack(spacing: Theme.Spacing.sm) {
            Button("Restore Purchases") {
                Task { await storeViewModel.restorePurchases() }
            }
            .font(Theme.Typography.footnote)
            .foregroundStyle(.secondary)
            .accessibilityLabel("Restore previous purchases")

            HStack(spacing: Theme.Spacing.sm) {
                Link("Terms", destination: Config.termsURL)
                Text("and")
                    .foregroundStyle(.tertiary)
                Link("Privacy", destination: Config.privacyURL)
            }
            .font(Theme.Typography.caption)

            Text("Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period.")
                .font(Theme.Typography.caption)
                .foregroundStyle(.tertiary)
                .multilineTextAlignment(.center)
        }
    }
}

// MARK: - Model

private struct PaywallFeature {
    let icon: String
    let title: String
    let description: String
}

#Preview {
    PaywallView()
        .environment(StoreViewModel())
}
