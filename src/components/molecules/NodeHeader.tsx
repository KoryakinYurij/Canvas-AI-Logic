import React from 'react';
import { Button } from '../atoms/Button';

interface NodeHeaderProps {
  title: string;
  icon?: string;
  onSettingsClick?: () => void;
}

export const NodeHeader: React.FC<NodeHeaderProps> = ({ title, icon, onSettingsClick }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
        <strong>{title}</strong>
      </div>
      <div>
        <Button onClick={onSettingsClick}>⚙️</Button>
      </div>
    </div>
  );
};
