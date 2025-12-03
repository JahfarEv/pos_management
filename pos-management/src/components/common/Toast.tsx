// import React from 'react';
// import { CheckCircle } from 'lucide-react';

// interface ToastProps {
//   message: string;
//   type?: 'success' | 'error' | 'warning';
//   isVisible: boolean;
// }

// export const Toast: React.FC<ToastProps> = ({ 
//   message, 
//   type = 'success', 
//   isVisible 
// }) => {
//   if (!isVisible) return null;

//   const bgColor = {
//     success: 'bg-green-100 border-green-400 text-green-800',
//     error: 'bg-red-100 border-red-400 text-red-800',
//     warning: 'bg-yellow-100 border-yellow-400 text-yellow-800'
//   }[type];

//   return (
//     <div className={`absolute top-14 right-4 ${bgColor} border px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-bounce z-50`}>
//       <CheckCircle size={16} />
//       <span className="font-semibold">{message}</span>
//     </div>
//   );
// };