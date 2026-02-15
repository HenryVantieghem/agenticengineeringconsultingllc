import SwiftUI

struct ProfileView: View {
    @Environment(ProfileViewModel.self) private var viewModel
    @Environment(AuthViewModel.self) private var authViewModel
    @State private var showEditProfile = false
    @State private var showSettings = false

    private let columns = [
        GridItem(.flexible(), spacing: 2),
        GridItem(.flexible(), spacing: 2),
        GridItem(.flexible(), spacing: 2)
    ]

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    ProgressView()
                        .accessibilityLabel("Loading profile")
                } else if let profile = viewModel.profile {
                    profileContent(profile)
                } else {
                    EmptyStateView(
                        icon: "person.crop.circle.badge.exclamationmark",
                        title: "Profile Not Found",
                        message: "Unable to load your profile. Please try again.",
                        actionTitle: "Retry"
                    ) {
                        Task { await viewModel.fetchProfile() }
                    }
                }
            }
            .navigationTitle("Profile")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showSettings = true
                    } label: {
                        Image(systemName: "gearshape")
                    }
                    .accessibilityLabel("Settings")
                }
            }
            .sheet(isPresented: $showEditProfile) {
                EditProfileView()
                    .environment(viewModel)
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
            .refreshable {
                await viewModel.fetchProfile()
            }
        }
    }

    // MARK: - Profile Content

    private func profileContent(_ profile: Profile) -> some View {
        ScrollView {
            VStack(spacing: Theme.Spacing.lg) {
                profileHeader(profile)
                statsRow
                editButton
                postsGrid
            }
            .padding(.vertical, Theme.Spacing.md)
        }
    }

    // MARK: - Header

    private func profileHeader(_ profile: Profile) -> some View {
        VStack(spacing: Theme.Spacing.md) {
            AvatarView(
                url: profile.avatarUrl,
                initials: profile.initials,
                size: 96
            )

            VStack(spacing: Theme.Spacing.xs) {
                Text(profile.displayName)
                    .font(Theme.Typography.title2)
                    .fontWeight(.bold)

                if let username = profile.username {
                    Text("@\(username)")
                        .font(Theme.Typography.subheadline)
                        .foregroundStyle(.secondary)
                }

                if let bio = profile.bio, !bio.isEmpty {
                    Text(bio)
                        .font(Theme.Typography.body)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, Theme.Spacing.xl)
                }
            }
        }
    }

    // MARK: - Stats

    private var statsRow: some View {
        HStack(spacing: Theme.Spacing.xxl) {
            statItem(value: viewModel.postCount, label: "Posts")
            statItem(value: viewModel.totalLikes, label: "Likes")
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(viewModel.postCount) posts, \(viewModel.totalLikes) likes")
    }

    private func statItem(value: Int, label: String) -> some View {
        VStack(spacing: 2) {
            Text("\(value)")
                .font(Theme.Typography.title3)
                .fontWeight(.bold)
            Text(label)
                .font(Theme.Typography.caption)
                .foregroundStyle(.secondary)
        }
    }

    // MARK: - Edit Button

    private var editButton: some View {
        Button {
            showEditProfile = true
        } label: {
            Text("Edit Profile")
                .font(Theme.Typography.subheadline)
                .fontWeight(.semibold)
                .frame(maxWidth: .infinity)
                .padding(.vertical, Theme.Spacing.sm)
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.md))
        }
        .padding(.horizontal, Theme.Spacing.lg)
        .accessibilityLabel("Edit your profile")
    }

    // MARK: - Posts Grid

    private var postsGrid: some View {
        Group {
            if viewModel.userPosts.isEmpty {
                VStack(spacing: Theme.Spacing.sm) {
                    Image(systemName: "square.grid.3x3")
                        .font(.system(size: 32))
                        .foregroundStyle(.tertiary)
                        .accessibilityHidden(true)
                    Text("No posts yet")
                        .font(Theme.Typography.footnote)
                        .foregroundStyle(.secondary)
                }
                .padding(.top, Theme.Spacing.xxl)
            } else {
                LazyVGrid(columns: columns, spacing: 2) {
                    ForEach(viewModel.userPosts) { post in
                        postGridItem(post)
                    }
                }
            }
        }
    }

    private func postGridItem(_ post: Post) -> some View {
        Group {
            if let imageUrl = post.imageUrl, let url = URL(string: imageUrl) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .scaledToFill()
                } placeholder: {
                    Rectangle()
                        .fill(.quaternary)
                }
                .aspectRatio(1, contentMode: .fill)
                .clipped()
            } else {
                Rectangle()
                    .fill(.ultraThinMaterial)
                    .aspectRatio(1, contentMode: .fill)
                    .overlay {
                        Text(post.content)
                            .font(Theme.Typography.caption)
                            .padding(Theme.Spacing.xs)
                            .lineLimit(4)
                    }
            }
        }
        .accessibilityLabel("Post: \(post.content.prefix(50))")
    }
}

#Preview {
    ProfileView()
        .environment(ProfileViewModel())
        .environment(AuthViewModel())
        .environment(StoreViewModel())
}
