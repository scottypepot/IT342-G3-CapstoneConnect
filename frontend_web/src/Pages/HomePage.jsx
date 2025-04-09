import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box
} from '@mui/material';
import { Helmet } from 'react-helmet';
import Logo from '../assets/logo.png';
import WelcomeModal from '../Pages/WelcomeModal'; // ✅ adjust path if needed

export default function HomePage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true); // default to true for demo

  // Optional: only show once on first load
  useEffect(() => {
    const hasShown = sessionStorage.getItem('hasShownWelcome');
    if (!hasShown) {
      setShowWelcomeModal(true);
      sessionStorage.setItem('hasShownWelcome', 'true');
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>CapstoneConnect - Find Your Perfect Team</title>
        <meta name="description" content="Swipe, match and collaborate with classmates" />
      </Helmet>

      <Box sx={{ backgroundColor: '#EEECEC', minHeight: '100vh', overflow: 'hidden' }}>
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
              <Button color="inherit" sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}>
                Find
              </Button>
              <Button color="inherit" sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}>
                Messages
              </Button>
              <Button color="inherit" sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}>
                Profile
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ✅ Welcome Modal */}
        <WelcomeModal
          open={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
        />
      </Box>
    </>
  );
}
