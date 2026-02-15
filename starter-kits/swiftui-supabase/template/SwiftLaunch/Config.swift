import Foundation

enum Config {
    static let supabaseURL = URL(string: "YOUR_SUPABASE_URL")!
    static let supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY"
    static let appGroupIdentifier = "group.com.yourapp.swiftlaunch"

    static let appName = "SwiftLaunch"
    static let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
    static let buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"

    static let termsURL = URL(string: "https://yourapp.com/terms")!
    static let privacyURL = URL(string: "https://yourapp.com/privacy")!
    static let supportEmail = "support@yourapp.com"

    enum StoreKit {
        static let monthlyProductID = "com.yourapp.swiftlaunch.monthly"
        static let yearlyProductID = "com.yourapp.swiftlaunch.yearly"
        static let lifetimeProductID = "com.yourapp.swiftlaunch.lifetime"

        static var allProductIDs: Set<String> {
            [monthlyProductID, yearlyProductID, lifetimeProductID]
        }
    }

    enum Storage {
        static let avatarsBucket = "avatars"
        static let postImagesBucket = "post-images"
    }

    enum Defaults {
        static let hasCompletedOnboarding = "hasCompletedOnboarding"
        static let preferredAppearance = "preferredAppearance"
        static let notificationsEnabled = "notificationsEnabled"
    }
}
