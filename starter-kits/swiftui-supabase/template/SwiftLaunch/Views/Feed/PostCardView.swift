import SwiftUI

struct PostCardView: View {
    @Environment(FeedViewModel.self) private var viewModel
    let post: Post
    @State private var showDeleteConfirmation = false

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
            headerRow
            contentSection
            if let imageUrl = post.imageUrl {
                imageSection(imageUrl)
            }
            footerRow
        }
        .padding(Theme.Spacing.md)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.lg))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 4)
        .confirmationDialog("Delete Post", isPresented: $showDeleteConfirmation) {
            Button("Delete", role: .destructive) {
                Task {
                    try? await viewModel.deletePost(post)
                }
            }
        } message: {
            Text("Are you sure you want to delete this post? This action cannot be undone.")
        }
    }

    // MARK: - Header

    private var headerRow: some View {
        HStack(spacing: Theme.Spacing.sm) {
            AvatarView(
                url: post.profile?.avatarUrl,
                initials: post.profile?.initials ?? "?",
                size: 40
            )

            VStack(alignment: .leading, spacing: 2) {
                Text(post.profile?.displayName ?? "Unknown")
                    .font(Theme.Typography.subheadline)
                    .fontWeight(.semibold)

                Text(post.timeAgo)
                    .font(Theme.Typography.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Menu {
                Button(role: .destructive) {
                    showDeleteConfirmation = true
                } label: {
                    Label("Delete Post", systemImage: "trash")
                }
            } label: {
                Image(systemName: "ellipsis")
                    .font(Theme.Typography.body)
                    .foregroundStyle(.secondary)
                    .frame(width: 32, height: 32)
                    .contentShape(Rectangle())
            }
            .accessibilityLabel("Post options")
        }
    }

    // MARK: - Content

    private var contentSection: some View {
        Text(post.content)
            .font(Theme.Typography.body)
            .lineLimit(nil)
            .fixedSize(horizontal: false, vertical: true)
    }

    // MARK: - Image

    private func imageSection(_ urlString: String) -> some View {
        AsyncImage(url: URL(string: urlString)) { phase in
            switch phase {
            case .success(let image):
                image
                    .resizable()
                    .scaledToFill()
                    .frame(maxHeight: 300)
                    .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.md))
                    .accessibilityLabel("Post image")

            case .failure:
                RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                    .fill(.quaternary)
                    .frame(height: 200)
                    .overlay {
                        Image(systemName: "photo")
                            .foregroundStyle(.secondary)
                    }
                    .accessibilityLabel("Failed to load image")

            case .empty:
                RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                    .fill(.quaternary)
                    .frame(height: 200)
                    .overlay {
                        ProgressView()
                    }
                    .accessibilityLabel("Loading image")

            @unknown default:
                EmptyView()
            }
        }
    }

    // MARK: - Footer

    private var footerRow: some View {
        HStack(spacing: Theme.Spacing.lg) {
            Button {
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                Task {
                    try? await viewModel.toggleLike(post)
                }
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: "heart")
                        .symbolVariant(post.likesCount > 0 ? .fill : .none)
                        .foregroundStyle(post.likesCount > 0 ? .red : .secondary)
                    if post.likesCount > 0 {
                        Text("\(post.likesCount)")
                            .font(Theme.Typography.footnote)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .accessibilityLabel("\(post.likesCount) likes. Double tap to toggle like.")

            Button {
                // Comment action placeholder
            } label: {
                Image(systemName: "bubble.left")
                    .foregroundStyle(.secondary)
            }
            .accessibilityLabel("Comment on post")

            Button {
                // Share action placeholder
            } label: {
                Image(systemName: "square.and.arrow.up")
                    .foregroundStyle(.secondary)
            }
            .accessibilityLabel("Share post")

            Spacer()
        }
        .font(Theme.Typography.subheadline)
    }
}

#Preview {
    let samplePost = Post(
        id: UUID(),
        userId: UUID(),
        content: "This is a sample post with some interesting content to display in the preview.",
        imageUrl: nil,
        likesCount: 42,
        createdAt: Date().addingTimeInterval(-3600),
        profile: Profile(
            id: UUID(),
            username: "johndoe",
            fullName: "John Doe",
            avatarUrl: nil,
            bio: nil,
            createdAt: Date(),
            updatedAt: Date()
        )
    )

    PostCardView(post: samplePost)
        .environment(FeedViewModel())
        .padding()
}
