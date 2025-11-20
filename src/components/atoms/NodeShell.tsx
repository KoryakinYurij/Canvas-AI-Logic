import React from 'react';

interface NodeShellProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const NodeShell: React.FC<NodeShellProps> = ({ children, style }) => {
  return (
    <div
      style={{
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
