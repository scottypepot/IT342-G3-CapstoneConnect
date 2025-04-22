import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleArrowClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar color="default" sx={{ height: 100, justifyContent: 'center' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button disableRipple onClick={() => navigate('/home')}>
          <img src={Logo} alt="CapstoneConnect Logo" style={{ maxWidth: '250px' }} />
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 5.5, marginRight: 20 }}>
          <Button 
            onClick={() => navigate('/home')} 
            color="inherit" 
            sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}
          >
            Find
          </Button>
          <Button 
            onClick={() => navigate('/messages')} 
            color="inherit" 
            sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}
          >
            Messages
          </Button>

          {/* Group Profile Button + IconButton without margin between them */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              onClick={() => navigate('/profile')} 
              color="inherit" 
              sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}
            >
              Profile
            </Button>
            <IconButton onClick={handleArrowClick} size="small">
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>

          {/* Logout Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  minWidth: 120,
                  borderRadius: 1,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                },
              },
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
