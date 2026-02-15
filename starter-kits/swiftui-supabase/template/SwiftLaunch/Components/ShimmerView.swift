import SwiftUI

struct ShimmerView: View {
    @State private var isAnimating = false

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                Rectangle()
                    .fill(.quaternary)

                Rectangle()
                    .fill(
                        LinearGradient(
                            gradient: Gradient(colors: [
                                .clear,
                                .white.opacity(0.3),
                                .clear
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .offset(x: isAnimating ? geometry.size.width : -geometry.size.width)
            }
        }
        .onAppear {
            withAnimation(
                .linear(duration: 1.5)
                .repeatForever(autoreverses: false)
            ) {
                isAnimating = true
            }
        }
        .accessibilityLabel("Loading content")
    }
}

struct ShimmerModifier: ViewModifier {
    let isActive: Bool

    func body(content: Content) -> some View {
        if isActive {
            content
                .redacted(reason: .placeholder)
                .overlay {
                    ShimmerView()
                        .mask(content)
                }
        } else {
            content
        }
    }
}

extension View {
    func shimmer(isActive: Bool = true) -> some View {
        modifier(ShimmerModifier(isActive: isActive))
    }
}

#Preview {
    VStack(spacing: 16) {
        ShimmerView()
            .frame(height: 200)
            .clipShape(RoundedRectangle(cornerRadius: 12))

        HStack(spacing: 12) {
            ShimmerView()
                .frame(width: 44, height: 44)
                .clipShape(Circle())

            VStack(alignment: .leading, spacing: 8) {
                ShimmerView()
                    .frame(height: 14)
                    .clipShape(RoundedRectangle(cornerRadius: 4))

                ShimmerView()
                    .frame(width: 120, height: 12)
                    .clipShape(RoundedRectangle(cornerRadius: 4))
            }
        }
    }
    .padding()
}
