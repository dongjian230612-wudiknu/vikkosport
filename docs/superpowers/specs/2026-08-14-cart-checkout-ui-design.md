# Vikko Sport — Cart + Checkout UI (Phase 1)

**Date:** 2026-08-14  
**Status:** Approved  
**Payment:** Simulated PayPal only (no real gateway)

## Goal

Ship a retail-style **Cart → Checkout (Address → Delivery → Payment) → Success** loop so RX and non-RX items can be reviewed and “paid” in the UI without a real payment provider.

## Non-goals

- Real PayPal / Stripe / Apple Pay
- Auth / Sign in
- Working promotion codes
- Persisting orders to Worker/KV/DB
- Tax calculation beyond a static $0 shipping option

## UX (from reference)

1. **Cart (`/cart`)** — Item table (ITEM / QUANTITY / TOTAL), optional Sign-in banner (placeholder), Summary sidebar, **Go to checkout**. Prescription items show a **Prescription** chip that opens a read-only Rx summary modal.
2. **Checkout (`/checkout`)** — Steps **1 Address → 2 Delivery → 3 Payment**; right rail **In your Cart** (subtotal / shipping / total). Back buttons between steps.
3. **Payment** — Order summary + demo PayPal CTA; on success navigate to `/checkout/success` and clear cart.
4. Brand: Vikko light retail (white / black / accent). PayPal demo button may use PayPal yellow for recognition.

## Data

- Extend cart line items with stable `id` for qty/remove when multiple lines share SKU/color.
- Checkout address + delivery method held in page/session state (not persisted).
- Success page shows a client-generated order id (`VS-…`).

## Acceptance

- [ ] `/cart` lists items; qty ± and delete work
- [ ] Empty cart shows CTA to shop
- [ ] Checkout blocked when cart empty
- [ ] Address validation before Delivery
- [ ] Free delivery $0 updates shipping line
- [ ] Demo Pay clears cart and shows success
- [ ] Prescription chip opens read-only Rx modal
- [ ] Sign in / promo links are non-functional placeholders
