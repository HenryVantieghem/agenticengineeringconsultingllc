import SwiftUI

struct SearchView: View {
    @State private var searchText = ""
    @State private var searchResults: [Profile] = []
    @State private var isSearching = false
    @State private var searchTask: Task<Void, Never>?

    var body: some View {
        NavigationStack {
            Group {
                if searchText.isEmpty {
                    emptySearchView
                } else if isSearching {
                    loadingView
                } else if searchResults.isEmpty {
                    EmptyStateView(
                        icon: "magnifyingglass",
                        title: "No Results",
                        message: "No users found for \"\(searchText)\". Try a different search term."
                    )
                } else {
                    resultsList
                }
            }
            .navigationTitle("Search")
        }
        .searchable(text: $searchText, prompt: "Search users...")
        .onChange(of: searchText) { _, newValue in
            performDebouncedSearch(query: newValue)
        }
    }

    // MARK: - Empty Search

    private var emptySearchView: some View {
        VStack(spacing: Theme.Spacing.lg) {
            Spacer()
            Image(systemName: "magnifyingglass")
                .font(.system(size: 48))
                .foregroundStyle(.tertiary)
                .accessibilityHidden(true)
            Text("Search for people")
                .font(Theme.Typography.title3)
                .foregroundStyle(.secondary)
            Spacer()
        }
    }

    // MARK: - Results List

    private var resultsList: some View {
        List(searchResults) { profile in
            HStack(spacing: Theme.Spacing.md) {
                AvatarView(
                    url: profile.avatarUrl,
                    initials: profile.initials,
                    size: 44
                )

                VStack(alignment: .leading, spacing: 2) {
                    Text(profile.displayName)
                        .font(Theme.Typography.subheadline)
                        .fontWeight(.semibold)

                    if let username = profile.username {
                        Text("@\(username)")
                            .font(Theme.Typography.footnote)
                            .foregroundStyle(.secondary)
                    }
                }

                Spacer()
            }
            .padding(.vertical, Theme.Spacing.xs)
            .accessibilityElement(children: .combine)
            .accessibilityLabel("\(profile.displayName)\(profile.username.map { ", @\($0)" } ?? "")")
        }
        .listStyle(.plain)
    }

    // MARK: - Loading

    private var loadingView: some View {
        VStack {
            Spacer()
            ProgressView("Searching...")
                .accessibilityLabel("Loading search results")
            Spacer()
        }
    }

    // MARK: - Search

    private func performDebouncedSearch(query: String) {
        searchTask?.cancel()

        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else {
            searchResults = []
            return
        }

        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(300))
            guard !Task.isCancelled else { return }

            await search(query: query)
        }
    }

    private func search(query: String) async {
        isSearching = true

        do {
            let results: [Profile] = try await SupabaseService.shared.fetch(
                from: "profiles",
                filter: { $0.ilike("full_name", pattern: "%\(query)%") },
                limit: 20
            )

            guard !Task.isCancelled else { return }

            await MainActor.run {
                self.searchResults = results
                self.isSearching = false
            }
        } catch {
            guard !Task.isCancelled else { return }
            await MainActor.run {
                self.isSearching = false
            }
        }
    }
}

#Preview {
    SearchView()
}
