export type ProductCategory = 'sunglasses' | 'eyeglasses' | 'accessories';
export type RxType = 'direct' | 'insert' | 'clip-on';

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  images: ProductImage[];
  colors: ProductColor[];
  category: ProductCategory;
  gender?: 'men' | 'women' | 'unisex';
  fit?: 'small' | 'medium' | 'large';
  isNew?: boolean;
  /** Sport / activity tags used by shop filters (e.g. cycling, running). */
  tags: string[];
  inStock: boolean;
  rxCompatible: boolean;
  /** How prescription is supported when rxCompatible is true. */
  rxType?: RxType | null;
  specs?: ProductSpecs;
  lensOptions?: LensOptions;
  rating: number;
  reviewCount: number;
}

export interface ProductSpecs {
  lensMaterial: string;
  frameMaterial: string;
  weight: string;
  uvProtection: string;
}

export interface LensOptions {
  colors: string[];
  photochromic: boolean;
  polarized: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  angle: 'front' | '45' | 'side' | 'detail';
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface CartRxExtras {
  rxInfo: RxInfo;
  lensUpcharge: number;
  lensColor?: string;
  photochromic?: boolean;
  polarized?: boolean;
  scene?: string;
  uploadName?: string;
}

export interface CartItem {
  product: Product;
  colorId: string;
  quantity: number;
  rxInfo?: RxInfo;
  lensUpcharge?: number;
  lensColor?: string;
  photochromic?: boolean;
  polarized?: boolean;
  scene?: string;
  uploadName?: string;
}

export interface RxInfo {
  sphereOd: number;
  sphereOs: number;
  cylinderOd?: number;
  cylinderOs?: number;
  axisOd?: number;
  axisOs?: number;
  pd: number;
  lensType: 'single-vision' | 'progressive' | 'bifocal';
  lensMaterial: 'polycarbonate' | 'trivex' | 'high-index';
}
