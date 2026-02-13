# App Store Review Rejections — Compound Knowledge Base

> Common App Store rejection reasons and how to avoid them
> Updated: 2026-02-13

---

## Top Rejection Reasons & Fixes

### 1. Guideline 4.0 — Design: Minimum Functionality
**Rejection:** "Your app does not include sufficient content and features to qualify as a useful app."

**Fix:**
- Ensure at least 3-5 core features are fully functional
- Include help/support content
- Add settings screen with account management
- Ensure all buttons/links work (no placeholder content)

### 2. Guideline 5.1.1 — Data Collection and Storage
**Rejection:** "We noticed your app collects user data but does not have a privacy policy."

**Fix:**
- Always include a privacy policy URL in App Store metadata
- Host privacy policy on a public URL before submission
- Include in-app link to privacy policy (Settings screen)
- Complete the App Privacy section in App Store Connect

### 3. Guideline 2.1 — Performance: App Completeness
**Rejection:** "We discovered one or more bugs in your app."

**Fix:**
- Test on physical devices (not just simulator)
- Test on oldest supported iOS version
- Test on iPhone SE (smallest screen) AND Pro Max (largest)
- Test all auth flows including error states
- Test with slow/no network connection
- Test with VoiceOver enabled

### 4. Guideline 4.8 — Sign in with Apple
**Rejection:** "Your app uses third-party login but does not offer Sign in with Apple."

**Fix:**
- If you offer Google, Facebook, or any OAuth login: you MUST also offer Apple Sign In
- Apple Sign In must be prominently displayed (not hidden)
- This is mandatory — no exceptions

### 5. Guideline 3.1.1 — In-App Purchase
**Rejection:** "Your app offers digital content/services but doesn't use in-app purchase."

**Fix:**
- All digital goods/subscriptions must use Apple's In-App Purchase
- Use RevenueCat or StoreKit 2 for subscription management
- You cannot link to external payment for digital goods
- Physical goods/services CAN use external payment

### 6. Guideline 2.3.3 — Screenshots
**Rejection:** "Screenshots do not sufficiently reflect the app in use."

**Fix:**
- Screenshots must show actual app UI (not marketing mockups only)
- Screenshots must be accurate to what the app looks like
- Include at least 3 screenshots per device size
- Show key features, not just the splash screen

### 7. Guideline 5.1.2 — Data Use and Sharing
**Rejection:** "Your app accesses user data but doesn't explain why."

**Fix:**
- Add purpose strings for all permissions in Info.plist:
  - NSCameraUsageDescription
  - NSPhotoLibraryUsageDescription
  - NSLocationWhenInUseUsageDescription
  - NSMicrophoneUsageDescription
- Explain specifically why you need each permission
- Don't request permissions you don't use

---

## Pre-Submission Checklist

- [ ] Privacy policy hosted and linked
- [ ] All purpose strings in Info.plist filled
- [ ] Sign in with Apple implemented (if using social auth)
- [ ] In-App Purchase for digital goods (if applicable)
- [ ] No placeholder content or broken links
- [ ] Tested on physical device
- [ ] Tested on minimum supported iOS version
- [ ] Screenshots match actual app UI
- [ ] App Privacy section completed in App Store Connect
- [ ] Demo account provided for reviewer (if behind auth)
- [ ] Review notes explain any non-obvious features
