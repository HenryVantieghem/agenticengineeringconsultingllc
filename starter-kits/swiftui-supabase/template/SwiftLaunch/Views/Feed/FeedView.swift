import SwiftUI

struct FeedView: View {
    @Environment(FeedViewModel.self) private var viewModel

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    loadingView
                } else if viewModel.posts.isEmpty {
                    EmptyStateView(
                        icon: "text.bubble",
                        title: "No Posts Yet",
                        message: "Be the first to share something with the community.",
                        actionTitle: "Create Post",
                        action: {}
                    )
                } else {
                    postsList
                }
            }
            .navigationTitle("Home")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        Task { await viewModel.refreshPosts() }
                    } label: {
                        Image(systemName: "arrow.clockwise")
                    }
                    .accessibilityLabel("Refresh feed")
                }
            }
        }
    }

    // MARK: - Posts List

    private var postsList: some View {
        ScrollView {
            LazyVStack(spacing: Theme.Spacing.md) {
                ForEach(viewModel.posts) { post in
                    PostCardView(post: post)
                        .environment(viewModel)
                }
            }
            .padding(.horizontal, Theme.Spacing.md)
            .padding(.vertical, Theme.Spacing.sm)
        }
        .refreshable {
            await viewModel.refreshPosts()
        }
    }

    // MARK: - Loading

    private var loadingView: some View {
        ScrollView {
            LazyVStack(spacing: Theme.Spacing.md) {
                ForEach(0..<5, id: \.self) { _ in
                    ShimmerView()
                        .frame(height: 200)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.lg))
                }
            }
            .padding(.horizontal, Theme.Spacing.md)
            .padding(.vertical, Theme.Spacing.sm)
        }
    }
}

#Preview {
    FeedView()
        .environment(FeedViewModel())
}
