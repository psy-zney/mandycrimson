
export type OrderMode = 'pickup' | 'international';

export interface ProductItem {
  id: string;
  name: string;
}

export interface OrderData {
  mode: OrderMode;
  customerName: string;
  instagram?: string;
  serialNumber?: string;
  phone?: string;
  address?: string;
  products: ProductItem[];
  footerNote: string;
}
