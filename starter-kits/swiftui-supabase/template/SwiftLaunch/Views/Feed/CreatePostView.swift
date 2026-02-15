import SwiftUI
import PhotosUI

struct CreatePostView: View {
    @Environment(FeedViewModel.self) private var feedViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var content = ""
    @State private var selectedItem: PhotosPickerItem?
    @State private var selectedImageData: Data?
    @State private var selectedImage: Image?
    @State private var isPosting = false
    @State private var error: String?

    private var canPost: Bool {
        !content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isPosting
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                if let error {
                    errorBanner(error)
                }

                ScrollView {
                    VStack(spacing: Theme.Spacing.md) {
                        textEditor
                        if let selectedImage {
                            imagePreview(selectedImage)
                        }
                    }
                    .padding(Theme.Spacing.md)
                }

                Divider()
                toolbarSection
            }
            .navigationTitle("New Post")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .disabled(isPosting)
                        .accessibilityLabel("Cancel creating post")
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Post") {
                        createPost()
                    }
                    .fontWeight(.semibold)
                    .disabled(!canPost)
                    .accessibilityLabel("Publish post")
                }
            }
            .onChange(of: selectedItem) { _, newItem in
                loadImage(from: newItem)
            }
            .interactiveDismissDisabled(isPosting)
        }
    }

    // MARK: - Text Editor

    private var textEditor: some View {
        ZStack(alignment: .topLeading) {
            if content.isEmpty {
                Text("What's on your mind?")
                    .foregroundStyle(.tertiary)
                    .padding(.top, 8)
                    .padding(.leading, 5)
                    .accessibilityHidden(true)
            }
            TextEditor(text: $content)
                .frame(minHeight: 120)
                .scrollContentBackground(.hidden)
                .accessibilityLabel("Post content")
                .accessibilityHint("Enter the content of your post")
        }
    }

    // MARK: - Image Preview

    private func imagePreview(_ image: Image) -> some View {
        ZStack(alignment: .topTrailing) {
            image
                .resizable()
                .scaledToFit()
                .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius.md))

            Button {
                withAnimation {
                    selectedItem = nil
                    selectedImageData = nil
                    selectedImage = nil
                }
            } label: {
                Image(systemName: "xmark.circle.fill")
                    .font(.title2)
                    .symbolRenderingMode(.palette)
                    .foregroundStyle(.white, .black.opacity(0.6))
            }
            .padding(Theme.Spacing.sm)
            .accessibilityLabel("Remove selected image")
        }
    }

    // MARK: - Toolbar

    private var toolbarSection: some View {
        HStack(spacing: Theme.Spacing.lg) {
            PhotosPicker(selection: $selectedItem, matching: .images) {
                Image(systemName: "photo.on.rectangle.angled")
                    .font(.title3)
                    .foregroundStyle(Theme.Colors.primary)
            }
            .accessibilityLabel("Add photo from library")

            Spacer()

            if isPosting {
                ProgressView()
                    .accessibilityLabel("Publishing post")
            }

            Text("\(content.count)")
                .font(Theme.Typography.caption)
                .foregroundStyle(content.count > 500 ? .red : .secondary)
                .accessibilityLabel("\(content.count) characters typed")
        }
        .padding(.horizontal, Theme.Spacing.md)
        .padding(.vertical, Theme.Spacing.sm)
    }

    // MARK: - Error Banner

    private func errorBanner(_ message: String) -> some View {
        HStack {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(.red)
                .accessibilityHidden(true)
            Text(message)
                .font(Theme.Typography.footnote)
                .foregroundStyle(.red)
            Spacer()
        }
        .padding(Theme.Spacing.sm)
        .background(.red.opacity(0.1))
    }

    // MARK: - Actions

    private func createPost() {
        guard canPost else { return }
        isPosting = true
        error = nil

        Task {
            do {
                try await feedViewModel.createPost(
                    content: content.trimmingCharacters(in: .whitespacesAndNewlines),
                    imageData: selectedImageData
                )
                UINotificationFeedbackGenerator().notificationOccurred(.success)
                dismiss()
            } catch {
                self.error = "Failed to create post. Please try again."
                isPosting = false
                UINotificationFeedbackGenerator().notificationOccurred(.error)
            }
        }
    }

    private func loadImage(from item: PhotosPickerItem?) {
        guard let item else { return }

        Task {
            if let data = try? await item.loadTransferable(type: Data.self) {
                selectedImageData = data
                if let uiImage = UIImage(data: data) {
                    selectedImage = Image(uiImage: uiImage)
                }
            }
        }
    }
}

#Preview {
    CreatePostView()
        .environment(FeedViewModel())
}
