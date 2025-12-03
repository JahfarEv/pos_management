// types/materialTypes.ts
export interface MaterialFormData {
  itemName: string;
  itemHsn: string;
  itemCode: string;
  barcode: string;
  purchaseRate: string;
  retailRate: string;
  wholesaleRate: string;
  unitPrimary: string;
  unitSecondary: string;
  conversionFactor: string;
  discountAmount: string;
  discountType: string;
  warehouse: string;
  taxPercentage: string;
  batchEnabled: boolean;
  serialNumberEnabled: boolean;
  enabledOpeningStock: boolean;
  openingStockQuantity: string;
  purchaseTax: string;
  retailTax: string;
  wholesaleTax: string;
  category: string;
  itemImage: File | null;
}

// Type for Redux thunk promise with unwrap
export interface UnwrappablePromise<T> extends Promise<T> {
  unwrap: () => Promise<T>;
}

// Type for product creation function
export type CreateProductFunction = (payload: any) => UnwrappablePromise<any> | Promise<any>;

// Type for category creation function
export type CreateCategoryFunction = (name: string, description?: string) => UnwrappablePromise<any> | Promise<any>;

export interface CategoryFunctions {
  addCategoryLocal: (name: string) => void;
  createCategoryOnServer: CreateCategoryFunction;
  setCategory: (category: string) => void;
}

export interface ProductFunctions {
  createProduct: CreateProductFunction;
}

// In types/materialTypes.ts - temporarily simplify
export interface MaterialFormFooterProps {
  formData: MaterialFormData;
  isSubmitting: boolean;
  productsLoading: boolean;
  categoriesNames: string[];
  setFormData: (data: MaterialFormData) => void;
  setError: (error: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;
  onClearAll: () => void;
  onClose: () => void;
  // Make these optional temporarily
  categoryFunctions?: any;
  productFunctions?: any;
}
export interface MaterialFormProps {
  formData: MaterialFormData;
  isSubmitting: boolean;
  error: string | null;
  categories: string[];
  selectedCategoryId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setError: (error: string | null) => void;
  openAddCategoryModal: () => void;
}