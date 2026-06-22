# SoulChain Manual Testing Procedures
## Comprehensive Testing Suite for Human QA

---

## 1. SMOKE TESTING (Critical Path Validation)

### Purpose: Verify core functionality works before deeper testing

### Test Cases:

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| SM-01 | Application Loads | 1. Navigate to localhost:5173 | App displays homepage with SoulChain logo | ☐ |
| SM-02 | Logo Visible | 1. Check header | SoulChain logo appears in top-left | ☐ |
| SM-03 | Hero Section | 1. View hero section | Video background plays, title visible | ☐ |
| SM-04 | Navigation Works | 1. Click each nav item | All pages load without errors | ☐ |
| SM-05 | Memory Vault Loads | 1. Click "Memory Vault" | Page displays upload form | ☐ |
| SM-06 | AI Companion Loads | 1. Click "AI Companion" | Chat interface displays | ☐ |
| SM-07 | Smart Contracts Loads | 1. Click "Smart Contracts" | Contract page displays | ☐ |
| SM-08 | Footer Present | 1. Scroll to bottom | Footer with 0G Labs link visible | ☐ |
| SM-09 | Video Background | 1. View home page hero | Video plays with overlay | ☐ |
| SM-10 | Links Work | 1. Click all links | All navigate correctly | ☐ |

**Smoke Test Result:** ☐ PASS / ☐ FAIL

---

## 2. FUNCTIONAL TESTING

### 2.1 Memory Storage Feature

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FN-MEM-01 | Enter Memory Text | 1. Navigate to Memory Vault<br>2. Type in textarea | Text appears, character count updates | ☐ |
| FN-MEM-02 | Character Count Updates | 1. Type text<br>2. Check counter | Counter shows correct count | ☐ |
| FN-MEM-03 | Empty Memory Submit | 1. Leave textarea empty<br>2. Click Upload | Error message or button disabled | ☐ |
| FN-MEM-04 | Valid Memory Upload | 1. Type valid memory<br>2. Click Upload<br>3. Wait | Progress bar appears, hash generated | ☐ |
| FN-MEM-05 | Progress Bar Animation | 1. Upload memory | Progress bar animates 0-100% | ☐ |
| FN-MEM-06 | Hash Generated | 1. Complete upload | Unique hash displayed | ☐ |
| FN-MEM-07 | Copy Hash | 1. Click hash | Hash copied to clipboard | ☐ |
| FN-MEM-08 | Clear Form | 1. Click Clear | Form resets to empty | ☐ |
| FN-MEM-09 | Retrieve Memory | 1. Upload memory<br>2. Click Retrieve | Decrypted memory displays | ☐ |
| FN-MEM-10 | Large Memory Upload | 1. Type 5000+ characters<br>2. Upload | Upload succeeds or shows appropriate limit | ☐ |

### 2.2 AI Companion Feature

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FN-AI-01 | Send Message | 1. Navigate to AI Companion<br>2. Type message<br>3. Press Enter | Message appears in chat | ☐ |
| FN-AI-02 | SoulChain Question | 1. Ask "What is SoulChain?" | Comprehensive response about SoulChain | ☐ |
| FN-AI-03 | Crypto Price Query | 1. Ask "Bitcoin price?" | Live price with source mentioned | ☐ |
| FN-AI-04 | 0G Labs Question | 1. Ask "Who is 0G Labs?" | Response about 0G Labs | ☐ |
| FN-AI-05 | Memory Search | 1. Upload memory<br>2. Ask "Show my memories" | Memories listed | ☐ |
| FN-AI-06 | Help Command | 1. Type "Help" | Command list shown | ☐ |
| FN-AI-07 | Empty Message | 1. Send empty message | No response or error shown | ☐ |
| FN-AI-08 | Multiple Messages | 1. Send 5+ messages | All messages appear in order | ☐ |
| FN-AI-09 | Quick Commands | 1. Click quick command button | Message sent automatically | ☐ |
| FN-AI-10 | Scroll Behavior | 1. Send many messages | Chat auto-scrolls to latest | ☐ |

### 2.3 Time Capsule Feature

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FN-TC-01 | Create Time Capsule | 1. Navigate to Time Capsule<br>2. Fill form<br>3. Submit | Capsule created successfully | ☐ |
| FN-TC-02 | Preset Time Selection | 1. Click preset button | Date updates to future date | ☐ |
| FN-TC-03 | Countdown Display | 1. Create capsule | Countdown timer shows | ☐ |
| FN-TC-04 | Past Date Validation | 1. Enter past date<br>2. Submit | Error shown or prevented | ☐ |
| FN-TC-05 | Json Valid Capsule | 1. Fill all fields correctly<br>2. Submit | Success message with hash | ☐ |
| FN-TC-06 | View Capsules List | 1. Create multiple capsules | All capsules appear in list | ☐ |
| FN-TC-07 | Capsule Status | 1. View capsule | Shows locked/pending/unlocked status | ☐ |

### 2.4 Legacy Beneficiary Feature

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FN-LG-01 | Add Beneficiary | 1. Navigate to Legacy<br>2. Fill form<br>3. Submit | Beneficiary added to list | ☐ |
| FN-LG-02 | Address Validation | 1. Enter invalid address | Shows validation error | ☐ |
| FN-LG-03 | Percentage Validation | 1. Enter invalid percentage | Shows validation error | ☐ |
| FN-LG-04 | Relationship Selection | 1. Select relationship | Dropdown updates | ☐ |
| FN-LG-05 | Activity Monitor | 1. View activity section | Shows "Active" status | ☐ |
| FN-LG-06 | Threshold Selection | 1. Select activity threshold | Threshold updates | ☐ |
| FN-LG-07 | Remove Beneficiary | 1. Click remove<br>2. Confirm | Beneficiary removed | ☐ |
| FN-LG-08 | Total Percentage | 1. Add multiple beneficiaries | Total equals 100% or shows warning | ☐ |

### 2.5 Memory NFT Feature

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FN-NFT-01 | Mint NFT | 1. Navigate to Memory NFTs<br>2. Fill form<br>3. Click Mint | NFT minted successfully | ☐ |
| FN-NFT-02 | Title Validation | 1. Enter short title | Shows minimum length requirement | ☐ |
| FN-NFT-03 | Visibility Toggle | 1. Toggle visibility switch | Switch toggles correctly | ☐ |
| FN-NFT-04 | View NFT Gallery | 1. Mint multiple NFTs | All NFTs appear in gallery | ☐ |
| FN-NFT-05 | NFT Hash Display | 1. View minted NFT | Hash shows in card | ☐ |
| FN-NFT-06 | Copy NFT Hash | 1. Click hash | Hash copied to clipboard | ☐ |

### 2.6 Multi-Media Upload

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FN-MM-01 | Select Image Type | 1. Click Image button | Image option highlighted | ☐ |
| FN-MM-02 | Upload Image | 1. Click upload zone<br>2. Select image | Image uploads with preview | ☐ |
| FN-MM-03 | Upload Audio | 1. Select Audio type<br>2. Upload file | Audio uploads with player | ☐ |
| FN-MM-04 | Upload Video | 1. Select Video type<br>2. Upload file | Video uploads with player | ☐ |
| FN-MM-05 | Drop Zone | 1. Drag file to drop zone | Drop zone highlights | ☐ |
| FN-MM-06 | Progress Indicator | 1. Upload large file | Progress bar shows | ☐ |
| FN-MM-07 | File Size Validation | 1. Upload oversized file | Shows size limit error | ☐ |

### 2.7 Memory Collections

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FN-COL-01 | Create Collection | 1. Click New Collection<br>2. Fill form<br>3. Submit | Collection created | ☐ |
| FN-COL-02 | Select Icon | 1. Click icon selector | Icon options appear | ☐ |
| FN-COL-03 | Select Color | 1. Click color selector | Color options appear | ☐ |
| FN-COL-04 | View Collections Grid | 1. Create multiple collections | All appear in grid | ☐ |
| FN-COL-05 | Delete Collection | 1. Click delete<br>2. Confirm | Collection removed | ☐ |
| FN-COL-06 | Add Memory to Collection | 1. Open collection<br>2. Add memory | Memory added to collection | ☐ |

### 2.8 Smart Contracts

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FN-SC-01 | Connect Wallet | 1. Click Connect Wallet | Mock wallet connects | ☐ |
| FN-SC-02 | Contract Address Pre-fill | 1. View form | Address already filled | ☐ |
| FN-SC-03 | Memory Hash Auto-load | 1. Upload memory in vault<br>2. Navigate to contracts | Hash auto-filled with indicator | ☐ |
| FN-SC-04 | Activate on Chain | 1. Fill all fields<br>2. Click Activate | Success message with tx hash | ☐ |
| FN-SC-05 | Copy Tx Hash | 1. Click transaction hash | Hash copied to clipboard | ☐ |
| FN-SC-06 | Disconnect Wallet | 1. Click Disconnect | Wallet disconnects | ☐ |

---

## 3. USABILITY TESTING

| ID | Test Case | Questions | Rating (1-5) |
|----|-----------|-----------|--------------|
| US-01 | Navigation Intuitiveness | Can users find features easily? | ___ |
| US-02 | Visual Design | Is the design appealing and consistent? | ___ |
| US-03 | Error Messages | Are errors clear and helpful? | ___ |
| US-04 | Form Labels | Are form fields clearly labeled? | ___ |
| US-05 | Button Labels | Do button labels match actions? | ___ |
| US-06 | Responsive Design | Does it work on different screen sizes? | ___ |
| US-07 | Loading States | Are loading states clear? | ___ |
| US-08 | Success Feedback | Is success clearly indicated? | ___ |
| US-09 | Feature Discovery | Can users discover all features? | ___ |
| US-10 | First-time User Experience | Can new users understand the app? | ___ |

---

## 4. PERFORMANCE TESTING

| ID | Test Case | Method | Expected | Actual | Status |
|----|-----------|--------|----------|--------|--------|
| PF-01 | Page Load Time | Refresh page | < 3 seconds | ___ | ☐ |
| PF-02 | Navigation Speed | Click nav items | < 500ms | ___ | ☐ |
| PF-03 | Upload Response | Submit memory | < 3 seconds | ___ | ☐ |
| PF-04 | AI Response Time | Send message | < 2 seconds | ___ | ☐ |
| PF-05 | Animation Smoothness | Watch animations | 60 FPS | ___ | ☐ |
| PF-06 | Memory Usage | Check DevTools | < 200MB | ___ | ☐ |
| PF-07 | Button Click Response | Click buttons | Immediate | ___ | ☐ |
| PF-08 | Video Background | Watch video playback | No stutter | ___ | ☐ |

---

## 5. COMPATIBILITY TESTING

### Browser Testing:

| Browser | Version | Result | Notes |
|---------|---------|--------|-------|
| Chrome | ___ | ☐ PASS / ☐ FAIL | |
| Firefox | ___ | ☐ PASS / ☐ FAIL | |
| Safari | ___ | ☐ PASS / ☐ FAIL | |
| Edge | ___ | ☐ PASS / ☐ FAIL | |
| Opera | ___ | ☐ PASS / ☐ FAIL | |

### Device Testing:

| Device | Resolution | Result | Notes |
|--------|------------|--------|-------|
| Desktop 4K | 3840x2160 | ☐ PASS / ☐ FAIL | |
| Desktop HD | 1920x1080 | ☐ PASS / ☐ FAIL | |
| Laptop | 1366x768 | ☐ PASS / ☐ FAIL | |
| Tablet | 768x1024 | ☐ PASS / ☐ FAIL | |
| Mobile Large | 428x926 | ☐ PASS / ☐ FAIL | |
| Mobile Small | 320x568 | ☐ PASS / ☐ FAIL | |

---

## 6. SECURITY TESTING

| ID | Test Case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| SEC-01 | XSS Prevention | Enter `<script>alert('xss')</script>` | Script not executed | ☐ |
| SEC-02 | Input Sanitization | Enter special characters | Properly escaped | ☐ |
| SEC-03 | HTTPS | Check URL | Connection secure | ☐ |
| SEC-04 | Local Storage | Check stored data | Sensitive data encrypted | ☐ |
| SEC-05 | Console Errors | Open DevTools | No sensitive errors logged | ☐ |
| SEC-06 | Disabled JavaScript | Disable JS in browser | Graceful degradation | ☐ |

---

## 7. ACCESSIBILITY TESTING

| ID | Test Case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| ACC-01 | Keyboard Navigation | Tab through elements | All elements reachable | ☐ |
| ACC-02 | Screen Reader | Use screen reader | Elements announced correctly | ☐ |
| ACC-03 | Color Contrast | Check contrast ratios | WCAG AA compliant (4.5:1) | ☐ |
| ACC-04 | Focus Indicators | Tab through | Focus visible on all elements | ☐ |
| ACC-05 | Alt Text | Check images | All images have alt text | ☐ |
| ACC-06 | Form Labels | Check forms | All inputs have labels | ☐ |
| ACC-07 | Touch Targets | Check mobile | Buttons min 44x44px | ☐ |

---

## 8. REGRESSION TEST CHECKLIST

Run after each change:

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Memory upload works
- [ ] AI companion responds
- [ ] Time capsule creation works
- [ ] Legacy beneficiary addition works
- [ ] NFT minting works
- [ ] Smart contract activation works
- [ ] All visual effects render
- [ ] No console errors
- [ ] Build succeeds

---

## 9. BUG REPORT TEMPLATE

### Bug ID: BUG-XXX

| Field | Value |
|-------|-------|
| **Title** | |
| **Severity** | ☐ Critical ☐ High ☐ Medium ☐ Low |
| **Priority** | ☐ P1 ☐ P2 ☐ P3 |
| **Environment** | Browser: ___ OS: ___ |
| **Steps to Reproduce** | 1.<br>2.<br>3. |
| **Expected Result** | |
| **Actual Result** | |
| **Screenshots** | |
| **Notes** | |

---

## 10. TEST EXECUTION SUMMARY

| Test Type | Total | Passed | Failed | Blocked |
|-----------|-------|--------|--------|---------|
| Smoke | 10 | | | |
| Functional | 60+ | | | |
| Usability | 10 | | | |
| Performance | 8 | | | |
| Compatibility | 11 | | | |
| Security | 6 | | | |
| Accessibility | 7 | | | |
| **TOTAL** | | | | |

**Overall Status:** ☐ PASS / ☐ FAIL

**Tested By:** ___________________

**Date:** ___________________

**Sign-off:** ___________________

---

End of Manual Testing Procedures
