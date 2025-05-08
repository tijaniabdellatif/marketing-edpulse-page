// components/hoc/Button.tsx
import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
      {children || "hey this is a button"}
    </button>
  );
};

export default Button;