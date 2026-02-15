// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "SwiftLaunch",
    platforms: [
        .iOS(.v18)
    ],
    products: [
        .library(
            name: "SwiftLaunch",
            targets: ["SwiftLaunch"]
        )
    ],
    dependencies: [
        .package(
            url: "https://github.com/supabase/supabase-swift.git",
            from: "2.0.0"
        )
    ],
    targets: [
        .target(
            name: "SwiftLaunch",
            dependencies: [
                .product(name: "Supabase", package: "supabase-swift")
            ],
            path: "SwiftLaunch"
        )
    ]
)
