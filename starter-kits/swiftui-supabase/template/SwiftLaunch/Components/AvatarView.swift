import SwiftUI

struct AvatarView: View {
    let url: String?
    let initials: String
    var size: CGFloat = 40

    var body: some View {
        Group {
            if let url, let imageURL = URL(string: url) {
                AsyncImage(url: imageURL) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .scaledToFill()

                    case .failure:
                        placeholderView

                    case .empty:
                        ProgressView()
                            .frame(width: size, height: size)

                    @unknown default:
                        placeholderView
                    }
                }
            } else {
                placeholderView
            }
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .accessibilityLabel("Avatar for \(initials)")
    }

    private var placeholderView: some View {
        ZStack {
            Circle()
                .fill(Theme.Colors.primary.opacity(0.15))

            Text(initials)
                .font(.system(size: size * 0.35, weight: .semibold, design: .rounded))
                .foregroundStyle(Theme.Colors.primary)
        }
    }
}

#Preview {
    VStack(spacing: 20) {
        AvatarView(url: nil, initials: "JD", size: 80)
        AvatarView(url: nil, initials: "AB", size: 56)
        AvatarView(url: nil, initials: "XY", size: 40)
        AvatarView(url: "https://example.com/avatar.jpg", initials: "EX", size: 64)
    }
}
