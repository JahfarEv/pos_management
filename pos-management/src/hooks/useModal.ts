import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  openItemListingModal,
  closeItemListingModal,
  openNewMaterialModal,
  closeNewMaterialModal,
  openEditMaterialModal as openEditMaterialModalAction,
  closeEditMaterialModal,
  openAddCategoryModal,
  closeAddCategoryModal,
  closeAllModals,
} from "../store/slices/modalSlice";

export const useModal = () => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector((state) => state.modal);

  return {
    // Modal state values
    isItemListingModalOpen: modalState.isItemListingModalOpen,
    isNewMaterialModalOpen: modalState.isNewMaterialModalOpen,
    isEditMaterialModalOpen: modalState.isEditMaterialModalOpen,
    isAddCategoryModalOpen: modalState.isAddCategoryModalOpen,
    editingProduct: modalState.editingProduct,

    // Modal actions
    openItemListingModal: () => dispatch(openItemListingModal()),
    closeItemListingModal: () => dispatch(closeItemListingModal()),
    openNewMaterialModal: () => dispatch(openNewMaterialModal()),
    closeNewMaterialModal: () => dispatch(closeNewMaterialModal()),
    openEditMaterialModal: (product: any) =>
      dispatch(openEditMaterialModalAction(product)),
    closeEditMaterialModal: () => dispatch(closeEditMaterialModal()),
    openAddCategoryModal: () => dispatch(openAddCategoryModal()),
    closeAddCategoryModal: () => dispatch(closeAddCategoryModal()),
    closeAllModals: () => dispatch(closeAllModals()),
  };
};
