import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleMicrosoftLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/microsoft';
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <img
          src={Logo}
          alt="CapstoneConnect Logo"
          style={{ width: '200px', marginBottom: '2rem' }}
        />
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to CapstoneConnect
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Find your perfect capstone teammate and bring your ideas to life!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleMicrosoftLogin}
          sx={{
            mt: 3,
            backgroundColor: '#2F2F2F',
            '&:hover': {
              backgroundColor: '#1a1a1a',
            },
          }}
        >
          Sign in with Microsoft
        </Button>
      </Box>
    </Container>
  );
} 