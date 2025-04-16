import React from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, Grid, Card, CardContent, Avatar } from '@mui/material';
import { Helmet } from 'react-helmet';
import Logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';


export default function MessagesPage() {
    const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>CapstoneConnect - Find Your Perfect Team</title>
        <meta name="description" content="Swipe, match and collaborate with classmates" />
      </Helmet>
      <Box sx={{ backgroundColor: '#EEECEC', minHeight: '100vh', overflow: 'hidden'}}>
        <AppBar className="navbar" color="default" sx={{ height: 100, justifyContent: 'center' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button>
              <img
                src={Logo}
                alt="CapstoneConnect Logo"
                style={{ maxWidth: '250px' }}
              />
            </Button>
            <Box sx={{ display: 'flex', gap: 5.5, marginRight: 20 }}>
              <Button onClick={() => navigate('/home')} color="inherit" sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}>
                Find
              </Button>
              <Button onClick={()=> navigate('/messages')} color="inherit" sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}>
                Messages
              </Button>
              <Button onClick={() => navigate('/profile')} color="inherit" sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}>
                Profile
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Typography variant="h4" fontWeight="bold" color="#4CAF50" sx={{ mt:25, pl:40,textAlign: 'left'}}>
          Messages
        </Typography>
        <Container sx={{ width: '100%'}}>
    

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
          <img
            src= '/croplogo.png'
            alt="No Matches"
            style={{ maxWidth: "200px", marginBottom: 2, marginTop: 110}}
          />

          <Typography variant="h4" fontWeight="bold" color="#003366" sx={{marginTop: 3}}>
            You Don’t Have Any Matches Yet!
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 400, color: "#000000", textAlign: 'center', fontSize: 17, marginTop: 1}}>
            Keep swiping! Your future capstone teammate is just around the corner.
          </Typography>
        </Box>
      </Container>
         
      </Box>
    </>
  );
}