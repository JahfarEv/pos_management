// import { createSlice } from "@reduxjs/toolkit";

// interface ModalState {
//   isItemListingModalOpen: boolean;
//   isNewMaterialModalOpen: boolean;
//   isAddCategoryModalOpen: boolean;
// }

// const initialState: ModalState = {
//   isItemListingModalOpen: false,
//   isNewMaterialModalOpen: false,
//   isAddCategoryModalOpen: false,
// };

// const modalSlice = createSlice({
//   name: "modal",
//   initialState,
//   reducers: {
//     openItemListingModal: (state) => {
//       state.isItemListingModalOpen = true;
//     },
//     closeItemListingModal: (state) => {
//       state.isItemListingModalOpen = false;
//     },
//     openNewMaterialModal: (state) => {
//       state.isNewMaterialModalOpen = true;
//     },
//     closeNewMaterialModal: (state) => {
//       state.isNewMaterialModalOpen = false;
//     },
//     openAddCategoryModal: (state) => {
//       state.isAddCategoryModalOpen = true;
//     },
//     closeAddCategoryModal: (state) => {
//       state.isAddCategoryModalOpen = false;
//     },
//     closeAllModals: (state) => {
//       state.isItemListingModalOpen = false;
//       state.isNewMaterialModalOpen = false;
//       state.isAddCategoryModalOpen = false;
//     },
//   },
// });

// export const {
//   openItemListingModal,
//   closeItemListingModal,
//   openNewMaterialModal,
//   closeNewMaterialModal,
//   openAddCategoryModal,
//   closeAddCategoryModal,
//   closeAllModals,
// } = modalSlice.actions;

// export default modalSlice.reducer;





// store/slices/modalSlice.ts
import { createSlice, } from '@reduxjs/toolkit';
import type { PayloadAction} from '@reduxjs/toolkit'
import type { Product } from './productsSlice'; // Make sure to import Product type

interface ModalState {
  isItemListingModalOpen: boolean;
  isNewMaterialModalOpen: boolean;
  isEditMaterialModalOpen: boolean;
  isAddCategoryModalOpen: boolean;
  editingProduct: Product | null;
}

const initialState: ModalState = {
  isItemListingModalOpen: false,
  isNewMaterialModalOpen: false,
  isEditMaterialModalOpen: false,
  isAddCategoryModalOpen: false,
  editingProduct: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openItemListingModal: (state) => {
      state.isItemListingModalOpen = true;
    },
    closeItemListingModal: (state) => {
      state.isItemListingModalOpen = false;
    },
    
    openNewMaterialModal: (state) => {
      state.isNewMaterialModalOpen = true;
    },
    closeNewMaterialModal: (state) => {
      state.isNewMaterialModalOpen = false;
    },
    
    openEditMaterialModal: (state, action: PayloadAction<Product>) => {
      state.isEditMaterialModalOpen = true;
      state.editingProduct = action.payload;
    },
    closeEditMaterialModal: (state) => {
      state.isEditMaterialModalOpen = false;
      state.editingProduct = null;
    },
    
    openAddCategoryModal: (state) => {
      state.isAddCategoryModalOpen = true;
    },
    closeAddCategoryModal: (state) => {
      state.isAddCategoryModalOpen = false;
    },
    
    closeAllModals: (state) => {
      state.isItemListingModalOpen = false;
      state.isNewMaterialModalOpen = false;
      state.isEditMaterialModalOpen = false;
      state.isAddCategoryModalOpen = false;
      state.editingProduct = null;
    },
  },
});

export const {
  openItemListingModal,
  closeItemListingModal,
  openNewMaterialModal,
  closeNewMaterialModal,
  openEditMaterialModal,
  closeEditMaterialModal,
  openAddCategoryModal,
  closeAddCategoryModal,
  closeAllModals,
} = modalSlice.actions;

export default modalSlice.reducer;