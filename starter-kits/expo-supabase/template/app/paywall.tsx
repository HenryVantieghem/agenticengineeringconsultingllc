import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Purchases, {
  type PurchasesOffering,
  type PurchasesPackage,
} from "react-native-purchases";
import { COLORS, REVENUECAT, APP_CONFIG } from "@/lib/constants";

interface PlanFeature {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

const premiumFeatures: PlanFeature[] = [
  { icon: "infinite", text: "Unlimited posts and interactions" },
  { icon: "analytics", text: "Advanced analytics dashboard" },
  { icon: "shield-checkmark", text: "Priority support" },
  { icon: "color-palette", text: "Custom themes and icons" },
  { icon: "cloud-upload", text: "Increased storage (10 GB)" },
  { icon: "notifications", text: "Smart notification filters" },
];

/**
 * RevenueCat-powered paywall screen with subscription options.
 * Fetches available offerings from RevenueCat and handles purchase flow.
 */
export default function PaywallScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        const current = offerings.current;
        if (current) {
          setOffering(current);
          // Default to annual if available, otherwise first package
          const annual = current.annual ?? current.availablePackages[0] ?? null;
          setSelectedPackage(annual);
        }
      } catch (error) {
        console.error("Error fetching offerings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  const handlePurchase = useCallback(async () => {
    if (!selectedPackage) return;

    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      const isPremium =
        typeof customerInfo.entitlements.active[REVENUECAT.entitlementId] !==
        "undefined";

      if (isPremium) {
        Alert.alert(
          "Welcome to Premium!",
          "You now have access to all premium features.",
          [{ text: "Continue", onPress: () => router.back() }]
        );
      }
    } catch (error) {
      // User cancelled purchase (error code 1) is normal, don't show alert
      if (
        error instanceof Error &&
        !error.message.includes("cancelled") &&
        !error.message.includes("canceled")
      ) {
        Alert.alert("Purchase Failed", error.message);
      }
    } finally {
      setPurchasing(false);
    }
  }, [selectedPackage, router]);

  const handleRestore = useCallback(async () => {
    setPurchasing(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isPremium =
        typeof customerInfo.entitlements.active[REVENUECAT.entitlementId] !==
        "undefined";

      if (isPremium) {
        Alert.alert("Restored!", "Your premium access has been restored.", [
          { text: "Continue", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(
          "No Purchases Found",
          "We couldn't find any previous purchases for this account."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Restore failed";
      Alert.alert("Error", message);
    } finally {
      setPurchasing(false);
    }
  }, [router]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
      {/* Close button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: Platform.OS === "ios" ? 60 : 16,
          right: 16,
          zIndex: 10,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="close" size={22} color={colors.text} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: COLORS.brand[500],
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="diamond" size={36} color="#ffffff" />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: colors.text,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Go Premium
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.muted,
              textAlign: "center",
              lineHeight: 24,
              paddingHorizontal: 16,
            }}
          >
            Unlock the full power of {APP_CONFIG.name} with unlimited access to
            all features.
          </Text>
        </View>

        {/* Features list */}
        <View
          style={{
            backgroundColor: isDark ? "#171717" : "#f8fafc",
            borderRadius: 16,
            padding: 20,
            marginBottom: 28,
            gap: 16,
          }}
        >
          {premiumFeatures.map((feature) => (
            <View
              key={feature.text}
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: isDark ? "#1e1b4b" : "#eef2ff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={feature.icon}
                  size={18}
                  color={COLORS.brand[500]}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: colors.text,
                }}
              >
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Package options */}
        {loading ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 40,
            }}
          >
            <ActivityIndicator size="large" color={COLORS.brand[500]} />
          </View>
        ) : offering ? (
          <View style={{ gap: 12, marginBottom: 24 }}>
            {offering.availablePackages.map((pkg) => {
              const isSelected = selectedPackage?.identifier === pkg.identifier;
              const isAnnual = pkg.packageType === "ANNUAL";

              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  onPress={() => setSelectedPackage(pkg)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isSelected
                      ? COLORS.brand[500]
                      : colors.border,
                    backgroundColor: isSelected
                      ? isDark
                        ? "rgba(99, 102, 241, 0.1)"
                        : "rgba(99, 102, 241, 0.04)"
                      : "transparent",
                    position: "relative",
                  }}
                >
                  {/* Radio indicator */}
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: isSelected
                        ? COLORS.brand[500]
                        : colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: COLORS.brand[500],
                        }}
                      />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: colors.text,
                      }}
                    >
                      {pkg.product.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.muted,
                        marginTop: 2,
                      }}
                    >
                      {pkg.product.priceString}
                      {isAnnual ? "/year" : "/month"}
                    </Text>
                  </View>

                  {/* Best value badge */}
                  {isAnnual && (
                    <View
                      style={{
                        position: "absolute",
                        top: -10,
                        right: 12,
                        backgroundColor: COLORS.brand[500],
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        BEST VALUE
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              paddingVertical: 32,
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 15, color: colors.muted }}>
              Unable to load subscription options.
            </Text>
          </View>
        )}

        {/* Purchase button */}
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={!selectedPackage || purchasing}
          activeOpacity={0.8}
          style={{
            backgroundColor: COLORS.brand[500],
            paddingVertical: 18,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            opacity: !selectedPackage || purchasing ? 0.5 : 1,
          }}
        >
          {purchasing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Subscribe Now
            </Text>
          )}
        </TouchableOpacity>

        {/* Restore purchases */}
        <TouchableOpacity
          onPress={handleRestore}
          disabled={purchasing}
          style={{ alignItems: "center", paddingVertical: 8 }}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
            }}
          >
            Restore Purchases
          </Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text
          style={{
            fontSize: 11,
            color: colors.muted,
            textAlign: "center",
            lineHeight: 16,
            marginTop: 16,
            paddingHorizontal: 16,
          }}
        >
          Payment will be charged to your {Platform.OS === "ios" ? "Apple ID" : "Google Play"} account. Subscription automatically
          renews unless cancelled at least 24 hours before the end of the
          current period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
