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
  category: 'sunglasses' | 'eyeglasses' | 'accessories';
  gender?: 'men' | 'women' | 'unisex';
  fit?: 'small' | 'medium' | 'large';
  isNew?: boolean;
  tags: string[];
  inStock: boolean;
  rxCompatible: boolean;
  rating: number;
  reviewCount: number;
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

export interface CartItem {
  product: Product;
  colorId: string;
  quantity: number;
  rxInfo?: RxInfo;
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
