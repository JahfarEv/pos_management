export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  retailRate?: number;
  purchaseRate?: number;
  category?: string;
  unitPrimary?:string;
}

export interface CartItem {
  product: string | CartProduct; 
  name?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error?: string | null;
}