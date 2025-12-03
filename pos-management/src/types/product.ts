export interface Product {
  _id?: string;          
  name: string;
    id: string;
  itemName: string;
  price: number;
  category?: string;
  stock: number;
  lowStock: boolean;
  description?: string;
  unit?: string;
  barcode?: string;
  sku?: string;


}