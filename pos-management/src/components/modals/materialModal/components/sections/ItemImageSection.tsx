import React from "react";
import { Upload } from "lucide-react";

interface ItemImageSectionProps {
  itemImage: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export const ItemImageSection: React.FC<ItemImageSectionProps> = ({
  itemImage,
  onFileChange,
  isSubmitting,
}) => {
  return (
    <div className="col-span-2">
      <label className="block text-sm text-gray-700">Item image</label>
      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md px-6 py-6 flex items-center justify-center w-1/2">
        <div className="text-center">
          <Upload size={28} className="mx-auto text-gray-400" />
          <div className="mt-3 text-sm text-gray-600">
            <label
              className={`cursor-pointer ${
                isSubmitting
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              <span>Upload image (max 5MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                disabled={isSubmitting}
                className="sr-only"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            PNG, JPG supported
          </p>
          {itemImage && (
            <p className="mt-1 text-xs text-green-600">
              Selected: {itemImage.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};