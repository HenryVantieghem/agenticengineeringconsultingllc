import SwiftUI

struct OnboardingView: View {
    @State private var currentPage = 0
    @Binding var hasCompletedOnboarding: Bool

    private let pages: [OnboardingPage] = [
        OnboardingPage(
            icon: "bolt.shield.fill",
            title: "Welcome to SwiftLaunch",
            subtitle: "Build and ship your iOS app faster than ever. Everything you need, nothing you don't.",
            color: .blue
        ),
        OnboardingPage(
            icon: "person.crop.circle.badge.checkmark",
            title: "Secure Authentication",
            subtitle: "Email, password, and Sign in with Apple built in. Your users are safe from day one.",
            color: .green
        ),
        OnboardingPage(
            icon: "star.circle.fill",
            title: "Monetize with Ease",
            subtitle: "StoreKit 2 subscriptions ready to go. Start earning from your very first launch.",
            color: .purple
        )
    ]

    var body: some View {
        VStack(spacing: 0) {
            TabView(selection: $currentPage) {
                ForEach(Array(pages.enumerated()), id: \.offset) { index, page in
                    pageView(page)
                        .tag(index)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .animation(.easeInOut, value: currentPage)

            bottomSection
        }
        .ignoresSafeArea(.container, edges: .top)
    }

    // MARK: - Page

    private func pageView(_ page: OnboardingPage) -> some View {
        VStack(spacing: Theme.Spacing.xl) {
            Spacer()

            Image(systemName: page.icon)
                .font(.system(size: 80))
                .foregroundStyle(page.color.gradient)
                .symbolEffect(.bounce, value: currentPage)
                .accessibilityHidden(true)

            VStack(spacing: Theme.Spacing.sm) {
                Text(page.title)
                    .font(Theme.Typography.title)
                    .fontWeight(.bold)
                    .multilineTextAlignment(.center)

                Text(page.subtitle)
                    .font(Theme.Typography.body)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, Theme.Spacing.lg)
            }

            Spacer()
            Spacer()
        }
        .padding(.horizontal, Theme.Spacing.lg)
    }

    // MARK: - Bottom Section

    private var bottomSection: some View {
        VStack(spacing: Theme.Spacing.lg) {
            pageIndicator

            if currentPage == pages.count - 1 {
                PrimaryButton(title: "Get Started") {
                    withAnimation {
                        hasCompletedOnboarding = true
                    }
                }
                .accessibilityLabel("Complete onboarding and get started")
            } else {
                PrimaryButton(title: "Continue") {
                    withAnimation {
                        currentPage += 1
                    }
                }
                .accessibilityLabel("Go to next onboarding page")
            }

            if currentPage < pages.count - 1 {
                Button("Skip") {
                    withAnimation {
                        hasCompletedOnboarding = true
                    }
                }
                .font(Theme.Typography.footnote)
                .foregroundStyle(.secondary)
                .accessibilityLabel("Skip onboarding")
            }
        }
        .padding(.horizontal, Theme.Spacing.lg)
        .padding(.bottom, Theme.Spacing.xl)
    }

    // MARK: - Page Indicator

    private var pageIndicator: some View {
        HStack(spacing: 8) {
            ForEach(0..<pages.count, id: \.self) { index in
                Capsule()
                    .fill(index == currentPage ? Theme.Colors.primary : Theme.Colors.primary.opacity(0.3))
                    .frame(width: index == currentPage ? 24 : 8, height: 8)
                    .animation(.spring(response: 0.3), value: currentPage)
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Page \(currentPage + 1) of \(pages.count)")
    }
}

// MARK: - Model

private struct OnboardingPage {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color
}

#Preview {
    OnboardingView(hasCompletedOnboarding: .constant(false))
}
