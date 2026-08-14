# Cart + Checkout UI Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Cart + three-step Checkout UI with simulated PayPal success.

**Architecture:** Extend `useCart` with line `id` + `clearCart`. New pages under `src/pages/` and small checkout components under `src/features/checkout/`. Routes in `App.tsx`. No backend orders.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind, wouter, existing `useCart` / `Button` / brand tokens.

## Global Constraints

- Colors: brand tokens only (`vikko-*`), except PayPal demo CTA yellow `#ffc439`
- No real payment APIs or secrets
- Max radius `rounded-lg`
- All fetches (none expected) need error handling if added later

---

### Task 1: Cart line identity + clearCart

**Files:** `src/types/product.ts`, `src/hooks/useCart.tsx`

- [ ] Add `id: string` to `CartItem`; generate on `addItem` (`crypto.randomUUID()` or fallback)
- [ ] Change `removeItem` / `updateQuantity` to key by `id`
- [ ] Add `clearCart()` and `subtotal` alias if useful
- [ ] Commit

### Task 2: Cart page

**Files:** `src/pages/Cart.tsx`, optional `src/features/checkout/CartRxModal.tsx`

- [ ] Layout: sign-in placeholder banner, Cart table, Summary, Go to checkout
- [ ] Qty controls + trash; Prescription chip → read-only modal from `rxInfo`
- [ ] Empty state → Shop / RX frames
- [ ] Commit

### Task 3: Checkout shell + Address

**Files:** `src/pages/Checkout.tsx`, `src/features/checkout/*`

- [ ] Step indicator; redirect if cart empty
- [ ] Address form (US defaults); validate required fields
- [ ] Right rail cart summary (shared component)
- [ ] Commit

### Task 4: Delivery + Payment + Success

**Files:** same feature folder + `src/pages/CheckoutSuccess.tsx`

- [ ] Delivery: Free 7–10 days $0; Back / Continue
- [ ] Payment: order summary + demo PayPal; clear cart → success
- [ ] Success page with order id
- [ ] Commit

### Task 5: Routes + Rx summary CTA

**Files:** `src/App.tsx`, `src/features/rx/StepSummary.tsx`

- [ ] Routes `/cart`, `/checkout`, `/checkout/success`
- [ ] After add-to-cart, offer View cart link
- [ ] Commit + push
