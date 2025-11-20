import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      style={{
        padding: '10px 15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
      {...props}
    >
      {children}
    </button>
  );
};
