import React, { useState } from "react";
import { X } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import useCategories from "../../hooks/useCategory";

const AddCategoryModal: React.FC = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAddCategoryModalOpen, closeAddCategoryModal } = useModal();

  const {
    addCategory,
    createCategoryOnServer,
    setCategory: selectCategory,
  } = useCategories();

  if (!isAddCategoryModalOpen) return null;

  const resetAndClose = () => {
    setCategory("");
    setDescription("");
    setError(null);
    setIsSubmitting(false);
    closeAddCategoryModal();
  };

  const handleSave = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    setError(null);
    const name = category.trim();
    if (!name) {
      setError("Category name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      addCategory(name);

      
      await createCategoryOnServer(name, description);

      selectCategory(name);

      resetAndClose();
    } catch (err: any) {
      console.error("Failed to create category on server:", err);
      setError(err?.message || "Failed to create category. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!isSubmitting) resetAndClose();
        }}
        aria-hidden
      />

      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add New Category</h3>
          <button
            onClick={() => {
              if (!isSubmitting) resetAndClose();
            }}
            aria-label="Close"
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <label className="block text-sm text-gray-700">Name *</label>
        <input
          type="text"
          placeholder="Category name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              if (!isSubmitting) resetAndClose();
            }}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            type="button"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            type="button"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
