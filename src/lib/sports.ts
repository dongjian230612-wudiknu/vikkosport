export interface SportItem {
  id: string;
  label: string;
  href: string;
  featured?: boolean;
}

/** Primary Sport mega-menu categories (Vikko Sport lineup). */
export const SPORTS: SportItem[] = [
  { id: 'road-cycling', label: 'Road Cycling', href: '/shop?sport=road-cycling', featured: true },
  { id: 'gravel-cycling', label: 'Gravel Cycling', href: '/shop?sport=gravel-cycling' },
  { id: 'mountain-bike', label: 'Mountain Bike', href: '/shop?sport=mountain-bike', featured: true },
  { id: 'trail-running', label: 'Trail Running', href: '/shop?sport=trail-running' },
  { id: 'running', label: 'Running', href: '/shop?sport=running', featured: true },
];

export const FEATURED_SPORTS = SPORTS.filter(s => s.featured);
