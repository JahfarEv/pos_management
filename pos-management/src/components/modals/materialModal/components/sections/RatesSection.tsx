import React from "react";

interface RatesSectionProps {
  type: 'purchase' | 'retail' | 'wholesale';
  rate: string;
  tax: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
  required?: boolean;
}

export const RatesSection: React.FC<RatesSectionProps> = ({
  type,
  rate,
  tax,
  onInputChange,
  isSubmitting,
  required = false,
}) => {
  const labels = {
    purchase: { title: "Purchase Rate", name: "purchaseRate", taxName: "purchaseTax" },
    retail: { title: "Retail Rate *", name: "retailRate", taxName: "retailTax" },
    wholesale: { title: "Wholesale Rate", name: "wholesaleRate", taxName: "wholesaleTax" },
  };

  const { title, name, taxName } = labels[type];

  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <label className="text-sm text-gray-700">{title}</label>
        <div className="flex items-center space-x-6">
          {['include', 'exclude'].map((taxOption) => (
            <div key={taxOption} className="flex items-center">
              <label className="text-sm text-gray-700 mr-2">
                {taxOption === 'include' ? 'Include' : 'Exclude'} Tax
              </label>
              <input
                type="radio"
                name={taxName}
                value={taxOption}
                checked={tax === taxOption}
                onChange={onInputChange}
                disabled={isSubmitting}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </div>
      <input
        type="number"
        name={name}
        value={rate}
        onChange={onInputChange}
        placeholder="0.00"
        disabled={isSubmitting}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        required={required}
      />
    </div>
  );
};