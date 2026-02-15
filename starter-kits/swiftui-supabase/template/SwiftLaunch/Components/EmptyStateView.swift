import SwiftUI

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String
    var actionTitle: String?
    var action: (() -> Void)?

    var body: some View {
        VStack(spacing: Theme.Spacing.lg) {
            Spacer()

            Image(systemName: icon)
                .font(.system(size: 56))
                .foregroundStyle(.tertiary)
                .symbolRenderingMode(.hierarchical)
                .accessibilityHidden(true)

            VStack(spacing: Theme.Spacing.sm) {
                Text(title)
                    .font(Theme.Typography.title3)
                    .fontWeight(.semibold)

                Text(message)
                    .font(Theme.Typography.body)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, Theme.Spacing.xl)
            }

            if let actionTitle, let action {
                PrimaryButton(title: actionTitle, style: .secondary, action: action)
                    .frame(width: 200)
                    .accessibilityLabel(actionTitle)
            }

            Spacer()
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(title). \(message)")
    }
}

#Preview {
    VStack(spacing: 40) {
        EmptyStateView(
            icon: "text.bubble",
            title: "No Posts Yet",
            message: "Be the first to share something.",
            actionTitle: "Create Post"
        ) {}

        EmptyStateView(
            icon: "magnifyingglass",
            title: "No Results",
            message: "Try a different search term."
        )
    }
}
