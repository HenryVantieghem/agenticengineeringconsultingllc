import SwiftUI

struct PrimaryButton: View {
    let title: String
    var isLoading: Bool = false
    var style: ButtonVariant = .filled
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing.sm) {
                if isLoading {
                    ProgressView()
                        .tint(style == .filled ? .white : Theme.Colors.primary)
                        .accessibilityLabel("Loading")
                }

                Text(title)
                    .fontWeight(.semibold)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(backgroundStyle)
            .foregroundStyle(foregroundStyle)
            .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.md))
            .overlay {
                if style == .outlined {
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                        .stroke(Theme.Colors.primary, lineWidth: 1.5)
                }
            }
        }
        .disabled(isLoading)
        .opacity(isLoading ? 0.8 : 1.0)
        .animation(.easeInOut(duration: 0.2), value: isLoading)
    }

    private var backgroundStyle: some ShapeStyle {
        switch style {
        case .filled:
            return AnyShapeStyle(Theme.Colors.primary.gradient)
        case .outlined:
            return AnyShapeStyle(Color.clear)
        case .secondary:
            return AnyShapeStyle(Theme.Colors.primary.opacity(0.12))
        }
    }

    private var foregroundStyle: Color {
        switch style {
        case .filled:
            return .white
        case .outlined, .secondary:
            return Theme.Colors.primary
        }
    }

    enum ButtonVariant {
        case filled
        case outlined
        case secondary
    }
}

#Preview {
    VStack(spacing: 16) {
        PrimaryButton(title: "Sign In", action: {})
        PrimaryButton(title: "Loading...", isLoading: true, action: {})
        PrimaryButton(title: "Outlined", style: .outlined, action: {})
        PrimaryButton(title: "Secondary", style: .secondary, action: {})
    }
    .padding()
}
