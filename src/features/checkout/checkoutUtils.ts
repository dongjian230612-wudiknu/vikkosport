import type { CartItem, RxInfo } from '../../types/product';
import { formatPrice } from '../../lib/utils';

export function lineUnitPrice(item: CartItem): number {
  return item.product.price + (item.lensUpcharge ?? 0);
}

export function lineTotal(item: CartItem): number {
  return lineUnitPrice(item) * item.quantity;
}

export function formatDiopterNum(n: number | undefined): string {
  if (n === undefined || Number.isNaN(n)) return '—';
  if (Object.is(n, -0) || n === 0) return '0.00';
  const fixed = n.toFixed(2);
  return n > 0 ? `+${fixed}` : fixed;
}

export function colorName(item: CartItem): string {
  return item.product.colors.find(c => c.id === item.colorId)?.name ?? item.colorId;
}

export function lensSummary(item: CartItem): string[] {
  const lines: string[] = [];
  lines.push(`Frame — ${formatPrice(item.product.price)}`);
  if (item.lensUpcharge != null && item.lensUpcharge > 0) {
    lines.push(`Lenses & options — ${formatPrice(item.lensUpcharge)}`);
  }
  if (item.lensColor) lines.push(item.lensColor);
  if (item.photochromic) lines.push('Photochromic');
  if (item.polarized) lines.push('Polarized');
  if (item.rxInfo) {
    const t = item.rxInfo.lensType.replace(/-/g, ' ');
    lines.push(t.charAt(0).toUpperCase() + t.slice(1));
  }
  return lines;
}

export type CheckoutAddress = {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  billingSame: boolean;
};

export const emptyAddress: CheckoutAddress = {
  country: 'United States',
  firstName: '',
  lastName: '',
  address: '',
  postalCode: '',
  city: '',
  state: '',
  email: '',
  phone: '',
  billingSame: true,
};

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export function validateAddress(a: CheckoutAddress): string | null {
  if (!a.firstName.trim() || !a.lastName.trim()) return 'Please enter your first and last name.';
  if (!a.address.trim()) return 'Please enter your address.';
  if (!a.postalCode.trim() || !a.city.trim()) return 'Please enter postal code and city.';
  if (!a.state) return 'Please select a state / province.';
  if (!a.email.trim() || !a.email.includes('@')) return 'Please enter a valid email.';
  if (!a.phone.trim()) return 'Please enter a phone number.';
  return null;
}

export function formatShipTo(a: CheckoutAddress): string {
  return `${a.firstName} ${a.lastName}, ${a.city}, ${a.country}`;
}

export function rxToDisplay(rx: RxInfo) {
  return {
    sphereOd: formatDiopterNum(rx.sphereOd),
    sphereOs: formatDiopterNum(rx.sphereOs),
    cylinderOd: formatDiopterNum(rx.cylinderOd),
    cylinderOs: formatDiopterNum(rx.cylinderOs),
    axisOd: rx.axisOd != null ? String(rx.axisOd) : '',
    axisOs: rx.axisOs != null ? String(rx.axisOs) : '',
    pd: String(rx.pd),
  };
}

export function newOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `VS-${n}`;
}
