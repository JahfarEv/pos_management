import React, { useState } from "react";
import { Header } from "../components/layout/Header";
import { SalesPanel } from "../components/salesSection/SalesPanel";
import { ActionBar } from "../components/layout/ActionBar";
import { ItemListingModal } from "../components/modals/itemListingModal/ItemListingModal";
import NewMaterialModal from "../components/modals/NewMaterialModal";
import AddCategoryModal from "../components/modals/CategoryModal";
import ProductsPage from "../components/productsSection/ProductPage";
import { useModal } from "../hooks/useModal";
import { useAuth } from "../hooks/useAuth";

const Dashboard: React.FC = () => {
  const { openItemListingModal } = useModal();
  const { logout } = useAuth();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleClearSelection = () => {
    setSelectedItemId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans text-sm overflow-hidden">
      <Header onLogout={logout} />

      <div className="flex flex-1 overflow-hidden">
        <SalesPanel
          selectedItemId={selectedItemId}
          onSelectItem={setSelectedItemId}
        />

        <div className="w-[65%] flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            <ProductsPage />
          </div>

          <ActionBar
            onOpenItemModal={openItemListingModal}
            selectedItemId={selectedItemId}
            onClearSelection={handleClearSelection}
          />
        </div>
      </div>

      <ItemListingModal />
      <NewMaterialModal />
      <AddCategoryModal />
    </div>
  );
};

export default Dashboard;