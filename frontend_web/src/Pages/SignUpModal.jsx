import { Box, Modal, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MicrosoftIcon from '@mui/icons-material/Microsoft'; 
import Logo from '../assets/logo.png';
import React, { useState } from 'react';
import MLogo from '../assets/microsoftlogo.png';
import CloseB from '../assets/closeicon.png';
import { API_URL } from '../config/api';

export default function SignUpModal({ open, handleClose }) {

  const handleMicrosoftSignUp = () => {
    window.location.href = `${API_URL}/oauth2/authorization/microsoft`;
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#F5EEEE',
        borderRadius: 4,
        boxShadow: 24,
        p: 4,
        textAlign: 'center'
      }}>

        <IconButton
                  onClick={handleClose}
                  sx={{ position: 'absolute', top: 8, right: 15, mt: 1}}
                >
                    <img src={CloseB} alt="close" style={{width: 24, height: 24}}/>
        </IconButton>

        <img src={Logo} alt="CapstoneConnect" style={{ height: 185, margin: '0 auto' }} />

        <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'black', fontSize: 19}}>
          Sign Up for an Account
        </Typography>

        <Button
          variant="contained"
          fullWidth
          startIcon={<img src={MLogo} alt="Microsoft Logo" style={{ width: 26, height: 26}}/>}
           onClick={handleMicrosoftSignUp}
          sx={{
            mt: 3,
            textTransform: 'none',
            borderRadius: 5,
            backgroundColor: '#003366',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#17518B'
            },
            height: 55,
            mb: 10,
            fontSize: 17
          }}
        >
          Sign up with Microsoft Account
        </Button>
      </Box>
    </Modal>
  );
}
