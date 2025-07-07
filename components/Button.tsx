import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  isLoading = false,
  className, 
  ...props 
}) => {
  const baseStyle = "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center justify-center";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      variantStyle = "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500";
      break;
    case 'secondary':
      variantStyle = "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400";
      break;
    case 'danger':
      variantStyle = "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400";
      break;
    case 'success':
      variantStyle = "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400";
      break;
  }

  let sizeStyle = "";
  switch (size) {
    case 'sm':
      sizeStyle = "py-1.5 px-3 text-sm";
      break;
    case 'md':
      sizeStyle = "py-2 px-4 text-base";
      break;
    case 'lg':
      sizeStyle = "py-2.5 px-5 text-lg";
      break;
  }

  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = props.disabled || isLoading ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${widthStyle} ${disabledStyle} ${className || ''}`}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className={`animate-spin -ml-1 mr-3 ${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};

export default Button;