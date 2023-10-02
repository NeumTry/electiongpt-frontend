import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const handleToggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleToggleSidebar}>
        <MenuIcon />
      </IconButton>
      {expanded && (
        <div style={{ width: 250, background: '#f0f0f0', height: '100vh' }}>
          {/* Sidebar content goes here */}
        </div>
      )}
    </div>
  );
}
