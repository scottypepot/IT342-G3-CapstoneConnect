import React, { useState, useEffect} from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, Grid, Card, CardContent, Avatar } from '@mui/material';
import '../styles/LandingCss.css';
import groupImage from '../assets/groupimage.png';
import Logo from '../assets/logo.png';
import Acc from '../assets/acc.png';
import Swipe from '../assets/swipe.png';
import Communicate from '../assets/communicate.png';
import Notify from '../assets/notify.png';
import Mobile from '../assets/mobile.png';
import Acad from '../assets/acad.png';
import { Helmet } from 'react-helmet';
import SignUpModal from './SignUpModal';
import LogInModal from './LogInModal';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { getAuthenticatedUser } from "./authService"; 



const developers = [
  {
    name: 'Jhovynn Aldrich Apurado',
    role: 'Mobile Developer',
    image: '/apurado.jpg',
  },
  {
    name: 'Scott Benzer Gitgano',
    role: 'Frontend Developer',
    image: '/gitgano.jpg',
  },
  {
    name: 'John Gerard Donaire',
    role: 'Backend Developer',
    image: '/donaire.jpg',
  },
];

const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
}
const scrollToFeatures = () => {
  const element = document.getElementById('features');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
const scrollToAbout = () => {
  const element = document.getElementById('about');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
const scrollToHome = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export default function LandingPage() {
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
        const user = await getAuthenticatedUser();

        if (user) {
            if (user.firstTimeUser) {
                window.location.href = "/home";
            } else {
                window.location.href = "/profile";
            }
        }
    };

    checkAuthentication();
}, []);

  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  useEffect(() => {
    AOS.init({
      duration: 1000, 
    });
  }, []);
  
  return (
    <>
      <Helmet>
        <title>CapstoneConnect - Find Your Perfect Team</title>
        <meta name="description" content="Swipe, match and collaborate with classmates" />
      </Helmet>
      <Box sx={{ backgroundColor: '#EEECEC', minHeight: '100vh' }}>
      <AppBar className="navbar" color="default" sx={{height: 90, justifyContent: 'center'}}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
        <Button onClick={scrollToHome}>
        <img
            src={Logo}
            alt="team"
            style={{maxWidth: '250px'}}
          />
        </Button>
        <Box sx={{ display: 'flex', gap: 5.5,marginRight: 2 }}>
        <Button onClick={scrollToHowItWorks} color="inherit" sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}>
                How it Works
        </Button>
        <Button onClick={scrollToFeatures}  color="inherit" sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}>
                Features
        </Button>
        <Button onClick={scrollToAbout} color="inherit" sx={{ fontSize: 20, fontWeight: 500, textTransform: 'none' }}>
                About
        </Button>
        <Button variant="outlined" onClick={() => handleOpenModal('login')} color='black' sx={{ fontSize: 17, fontWeight: 500, textTransform: 'none' }}>
                Login
        </Button>
        </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: '100%', mt: 18}}>
  <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' },gap: 4, alignItems: 'center', mt: { xs: 4, md: 10 } }}>
      {/* Text Column */}
      <div data-aos="fade-right">
      <Box sx={{ flex: 1, pr: { md: 4 }, textAlign: 'left', width: '100%'}}>
        <Typography 
          sx={{ 
            color: '#003366', 
            fontWeight: 'bold',
            fontSize: {
              xs: 40,  // extra-small screens
              sm: 60,  // small screens
              md: 80,  // medium screens
              lg: 90   // large screens and up
            },
            lineHeight: 1.1,
            whiteSpace: 'nowrap'
          }}
        >
          Find your perfect
        </Typography>
        <Typography 
          variant="h1" 
          sx={{ 
            color: '#4CAF50', 
            fontWeight: 'bold',
            fontSize: {
              xs: 40,  // extra-small screens
              sm: 60,  // small screens
              md: 80,  // medium screens
              lg: 90   // large screens and up
            },
            lineHeight: 1.1,
            mb: 2
          }}
        >
          Capstone Team
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: { xs: '1rem', md: '1.25rem' },
            mb: 3,
            maxWidth: '90%'
          }}
        >
          Swipe, Match, and Collaborate with your schoolmates who share your interest and compliment your skills. Build amazing projects together!
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: '#4CAF50', 
            color: '#FFFFFF',
            textTransform: 'none',
            px: 4,
            py: 1,
            fontSize: '1rem'
          }}
          onClick={() => handleOpenModal('signup')}
        >
          Sign Up
        </Button>
      </Box>
      </div>
      <div data-aos="fade-left">
      {/* Image Column */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'flex-end',
          width: '100%',
          mt: { xs: 4, md: 0 },
        }}
      >
        <img
          src={groupImage}
          alt="team"
          style={{
            maxWidth: '100%',
            height: '400px'
          }}
        />
      </Box>
    </div>
    </Box>
  </Container>
</Box>

      <Container id="how-it-works" sx={{ py: 6, marginTop: 20, scrollMarginTop: 130 }}>
      <div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
        <Typography variant="h5" fontWeight="600" gutterBottom>
          HOW IT WORKS
        </Typography>
        <Typography variant="h2" fontWeight="bold" sx={{fontSize: 60}}>
        <span style={{ color: '#003366' }}>Find your dream team in 3 simple steps</span>
        </Typography>
        <Typography variant="subtitle1" fontWeight="300" gutterBottom sx={{fontSize: 23, maxWidth: 800, mx:'auto', marginTop: 3}}>
        <span style={{ color: 'black' }}>CapstoneConnect makes it easy to find teammates with complementary skills and interest</span>
        </Typography>
        </div>
        </Container>

        <Box sx={{ width: '100%', px: 0}}> 
        <Container  maxWidth={false} sx={{ maxWidth: '1400px', marginTop: 6}}>
        <Grid container spacing={0} columns={24} sx={{maxHeight: 700}}>
          <Grid size={8}>
          <div data-aos="zoom-in-right">
              <CardContent>
                <img src={Acc} alt="create-account"/>
                <Typography variant="h4" fontWeight="bold" fontSize={30} marginTop={2}>Create Your Profile</Typography>
                <Typography variant="body2" fontSize={18} fontWeight="100" marginTop={2}>
                Show case your skills, project interest, goals, and your previous projects
                </Typography>
              </CardContent>
          </div>
          </Grid>
          <Grid size={8}>
          <div data-aos="zoom-in-up">
              <CardContent>
              <img src={Swipe} alt="swiping"/>
                <Typography variant="h4" fontWeight="bold" fontSize={30} marginTop={2}>Swipe to Connect</Typography>
                <Typography variant="body2" fontSize={18} fontWeight="100" marginTop={2}>
                Browse through profiles and swipe right on students who you’d like to work with
                </Typography>
              </CardContent>
          </div>
          </Grid>
          <Grid size={8}>
          <div data-aos="zoom-in-left">
              <CardContent>
              <img src={Communicate} alt="comms"/>
                <Typography variant="h4" fontWeight="bold" fontSize={30} marginTop={2}>Connect & Collaborate</Typography>
                <Typography variant="body2" fontSize={18} fontWeight="100" marginTop={2}>
                  When there’s a mutual match, start chatting and planning your capstone project
                </Typography>
              </CardContent>
          </div>
          </Grid>
        </Grid>
      </Container>
      </Box>

      <Container id="features" sx={{ py: 6, marginTop: 19, scrollMarginTop: 130}}>
      <div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          FEATURES
        </Typography>
        <Typography variant="h2" fontWeight="bold" sx={{fontSize: 50}}>
        <span style={{ color: '#003366' }}>Everything you need to build your perfect team</span>
        </Typography>
      </div>
        <Grid container spacing={3} columns={24} marginTop={13} justifyContent={'center'} gap={10}>
          <Grid size={6}>
          <div data-aos="fade-up">
            <Card className="real-time" variant="outlined" sx={{height: '100%',minHeight: 250, alignContent: 'center', borderRadius: 4,border: '1px solid #7390AE', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
              <CardContent sx={{textAlign: 'left'}}>
                <img src={Notify} alt="notify"/>
                <Typography variant="h6" sx={{marginTop: 1.5,  fontWeight: '600'}}>Real-time Notifications</Typography>
                <Typography variant="body2" sx={{marginTop: 1.5, maxWidth: 200}}>
                  Get notifiy instantly when you match someone or receive a message
                </Typography>
              </CardContent>
            </Card>
            </div>
          </Grid>
          <Grid size={6}>
          <div data-aos="fade-up">
            <Card className="mobile-friendly" variant="outlined" sx={{height: '100  %',minHeight: 250, alignContent: 'center',borderRadius: 4,border: '1px solid #7390AE', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
              <CardContent sx={{textAlign: 'left'}}>
              <img src={Mobile} alt="mobile"/>
                <Typography variant="h6" sx={{marginTop: 1.5,  fontWeight: '600'}}>Mobile Friendly</Typography>
                <Typography variant="body2" sx={{marginTop: 1.5, maxWidth: 230}}>
                  Find teammates on the go with our responsive, swipe-friendly interface
                </Typography>
              </CardContent>
            </Card>
            </div>
          </Grid>
          <Grid size={6}>
          <div data-aos="fade-up">
            <Card className="academic" variant="outlined" sx={{height: '100%',minHeight: 250, alignContent: 'center', borderRadius: 4,border: '1px solid #7390AE', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
              <CardContent sx={{textAlign: 'left'}}>
                <img src={Acad} alt="acad"/>
                <Typography variant="h6" sx={{marginTop: 1.5, fontWeight: '600'}}>Academic Focus</Typography>
                <Typography variant="body2" sx={{marginTop: 1.5, maxWidth: 230}}>
                  Built specifically for capstone project and academic collaboration
                </Typography>
              </CardContent>
            </Card>
            </div>
          </Grid>
        </Grid>
      </Container>

      <Container id="about" sx={{ py: 6, marginTop: 10,marginBottom: 2, scrollMarginTop: 130}}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ABOUT
        </Typography>
        <Typography variant="h2" fontWeight="bold" sx={{fontSize: 50}}>
        <span style={{ color: '#003366' }}>The developers who made this happen</span>
        </Typography>
        <Typography variant="subtitle1" fontWeight="300" gutterBottom sx={{fontSize: 23, width: '100%',mx:'auto'}}>
        <span style={{ color: 'black'}}>So CapstoneConnect is a platform that helps people with similar skills and project interests find each other and work together. It lets users create profiles, match with others, chat, and form teams.</span>
        </Typography>

        <Grid container spacing={4} columns={24} justifyContent={'center'} sx={{ mt: 2, marginTop: 10}}>
          {developers.map((dev, index) => (
            <Grid size={6} key={index}>
              <Card variant="outlined" sx={{ height: '100%',minHeight: 250, textAlign: 'center', py: 2, backgroundColor: '#2E2F44'}}>
                <Avatar
                  src={dev.image}
                  alt={dev.name}
                  sx={{marginTop: 2, width: 100, height: 100, mx: 'auto', mb: 1}}
                />
                <Typography variant="subtitle1" color='white' fontSize={18} fontWeight="600" marginTop={5}>
                  {dev.name}
                </Typography>
                <Typography variant="body2" color='white' fontSize={15} marginTop={1}>{dev.role}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
        
      </Container>
        <img src={Logo} alt="logo" style={{maxWidth: '300px'}} />
        <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f5f5f5' }}>
        <Typography variant="body2">©2025 Capstone Connect. All rights reserved.</Typography>
        </Box>
      </Box>

      <SignUpModal
          open={modalType === 'signup'}
          handleClose={handleCloseModal}
      />

      <LogInModal
          open={modalType === 'login'}
          handleClose={handleCloseModal}
          // handleMicrosoftLogin={handleMicrosoftLogin}
      />
    </>
  );
}
