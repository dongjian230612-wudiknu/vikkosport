export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface NavColumn {
  title: string;
  items: NavLink[];
}

/** Sunglasses mega-menu — Rx lives under Prescription Sunglasses. */
export const SUNGLASSES_NAV: NavColumn[] = [
  {
    title: 'By Category',
    items: [
      { id: 'all-sunglasses', label: 'All Sunglasses', href: '/shop?type=sunglasses' },
      { id: 'rx-sunglasses', label: 'Prescription Sunglasses', href: '/shop?type=sunglasses&rx=1' },
      { id: 'mens-sunglasses', label: "Men's Sunglasses", href: '/shop?type=sunglasses&gender=men' },
      { id: 'womens-sunglasses', label: "Women's Sunglasses", href: '/shop?type=sunglasses&gender=women' },
      { id: 'new-sunglasses', label: 'New Arrivals', href: '/shop?type=sunglasses&new=1' },
    ],
  },
  {
    title: 'By Sport',
    items: [
      { id: 'sg-cycling', label: 'Cycling', href: '/shop?type=sunglasses&sport=cycling' },
      { id: 'sg-running', label: 'Running', href: '/shop?type=sunglasses&sport=running' },
      { id: 'sg-all-sports', label: 'All Sports', href: '/shop?type=sunglasses&sport=all' },
    ],
  },
  {
    title: 'By Fit',
    items: [
      { id: 'fit-small', label: 'Small Face', href: '/shop?type=sunglasses&fit=small' },
      { id: 'fit-medium', label: 'Medium', href: '/shop?type=sunglasses&fit=medium' },
      { id: 'fit-large', label: 'Large', href: '/shop?type=sunglasses&fit=large' },
    ],
  },
];

/** Eyeglasses mega-menu — frames are prescription by default (no Rx label). */
export const EYEGLASSES_NAV: NavColumn[] = [
  {
    title: 'By Category',
    items: [
      { id: 'all-eyeglasses', label: 'All Eyeglasses', href: '/shop?type=eyeglasses' },
      { id: 'mens-eyeglasses', label: "Men's Eyeglasses", href: '/shop?type=eyeglasses&gender=men' },
      { id: 'womens-eyeglasses', label: "Women's Eyeglasses", href: '/shop?type=eyeglasses&gender=women' },
      { id: 'new-eyeglasses', label: 'New Arrivals', href: '/shop?type=eyeglasses&new=1' },
    ],
  },
  {
    title: 'By Sport',
    items: [
      { id: 'eg-cycling', label: 'Cycling', href: '/shop?type=eyeglasses&sport=cycling' },
      { id: 'eg-running', label: 'Running', href: '/shop?type=eyeglasses&sport=running' },
    ],
  },
];

export function flattenNav(columns: NavColumn[]): NavLink[] {
  return columns.flatMap(col => col.items);
}
