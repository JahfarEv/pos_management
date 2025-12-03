// import React from 'react';

// interface ButtonProps {
//   children: React.ReactNode;
//   onClick?: () => void;
//   variant?: 'primary' | 'secondary' | 'danger' | 'success';
//   size?: 'sm' | 'md' | 'lg';
//   className?: string;
//   disabled?: boolean;
// }

// export const Button: React.FC<ButtonProps> = ({
//   children,
//   onClick,
//   variant = 'primary',
//   size = 'md',
//   className = '',
//   disabled = false
// }) => {
//   const baseClasses = 'rounded font-bold transition-colors focus:outline-none focus:ring-2';
  
//   const variantClasses = {
//     primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
//     secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-300',
//     danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
//     success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300'
//   }[variant];

//   const sizeClasses = {
//     sm: 'px-2 py-1 text-xs',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base'
//   }[size];

//   return (
//     <button
//       className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className} ${
//         disabled ? 'opacity-50 cursor-not-allowed' : ''
//       }`}
//       onClick={onClick}
//       disabled={disabled}
//     >
//       {children}
//     </button>
//   );
// };