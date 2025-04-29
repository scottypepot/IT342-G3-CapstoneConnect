import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { API_URL, FRONTEND_URL } from '../config/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleArrowClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogoutClick = () => {
    handleClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const clearAllBrowserData = () => {
    // Clear all localStorage
    localStorage.clear();
    
    // Clear all sessionStorage
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear any cached auth tokens
    if (window.indexedDB) {
      indexedDB.deleteDatabase("auth");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      // Clear all browser data regardless of response
      clearAllBrowserData();

      // Get the Microsoft tenant ID and client ID from your configuration
      const tenantId = "common"; // or your specific tenant ID
      const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
      
      // Construct the OIDC logout URL with all necessary parameters
      const logoutUrl = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/logout");
      logoutUrl.searchParams.append("post_logout_redirect_uri", FRONTEND_URL);
      logoutUrl.searchParams.append("client_id", clientId);
      
      // Redirect to Microsoft logout
      window.location.href = logoutUrl.toString();
    } catch (error) {
      console.error("❌ Logout failed:", error);
      // If error occurs, still clear data and redirect
      clearAllBrowserData();
      window.location.href = FRONTEND_URL;
    }
  };

  return (
    <>
      <AppBar color="default" sx={{ height: 90, justifyContent: 'center' }}>
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
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 300,
            backgroundColor: '#2E2F44',
            color: 'white',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleLogoutCancel}
            variant="outlined" 
            sx={{ 
              minWidth: 100,
              mr: 1,
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            No
          </Button>
          <Button 
            onClick={handleLogout}
            variant="contained" 
            sx={{ 
              minWidth: 100,
              ml: 1,
              backgroundColor: '#577058',
              color: 'white',
              '&:hover': {
                backgroundColor: '#4a604b',
              },
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
