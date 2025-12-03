import React, { useState } from 'react';
import { getCurrentDate, generateInvoiceNumber } from '../../utils/helpers';

export const CustomerInfo: React.FC = () => {
  const [invoiceNo] = useState(generateInvoiceNumber());
  const [date] = useState(getCurrentDate());
  const [customerName, setCustomerName] = useState('Cash');
  const [phone, setPhone] = useState('');

  return (
    <>
      {/* Inputs Row 1 */}
      <div className="flex gap-2 mb-2">
        <div className="w-1/3">
          <label className="text-gray-500">Invoice No</label>
          <input 
            type="text" 
            value={invoiceNo}
            className="w-full border border-gray-300 rounded px-2 py-2 bg-gray-50" 
            readOnly 
          />
        </div>
        <div className="w-1/3">
          <label className="text-gray-500 ">User</label>
          <input 
            type="text" 
            value="7034753806" 
            className="w-full border border-gray-300  rounded px-2 py-2 bg-gray-50" 
            readOnly 
          />
        </div>
        <div className="w-1/3">
          <label className="text-gray-500 ">Date</label>
          <input 
            type="date" 
            value={date}
            className="w-full border border-gray-300 rounded px-2 py-2" 
            readOnly
          />
        </div>
      </div>

      {/* Inputs Row 2 */}
      <div className="flex gap-2 my-2">
        <input 
          placeholder="Customer Name" 
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-2 py-2 w-1/2" 
        />
        <select 
          className="border border-gray-300 rounded-md px-2 py-2 w-1/2"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        >
          <option>Cash</option>
          <option>Card</option>
          <option>Digital</option>
        </select>
      </div>
      
      <input 
        placeholder="Phone" 
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-2 py-2 my-2" 
      />
      
      <div className="flex gap-2">
        <input placeholder="Bar Code" className="flex-1 border border-gray-300 rounded-md px-2 py-2" />
        <input placeholder="Item" className="flex-1 border border-gray-300 rounded-md px-2 py-2" />
      </div>
    </>
  );
};