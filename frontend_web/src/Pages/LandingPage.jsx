import React from 'react';
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

const developers = [
  {
    name: 'Jhovynn Aldrich Apurado',
    role: 'Mobile Developer',
    image: 'https://via.placeholder.com/100',
  },
  {
    name: 'Scott Benzer Gitgano',
    role: 'Frontend Developer',
    image: 'https://via.placeholder.com/100',
  },
  {
    name: 'John Gerard Donaire',
    role: 'Backend Developer',
    image: 'https://via.placeholder.com/100',
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
  return (
    <>
      <Helmet>
        <title>CapstoneConnect - Find Your Perfect Team</title>
        <meta name="description" content="Swipe, match and collaborate with classmates" />
      </Helmet>
      <Box sx={{ backgroundColor: '#EEECEC', minHeight: '100vh' }}>
      <AppBar className="navbar" color="default" sx={{height: 120, justifyContent: 'center'}}>
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
        <Button variant="outlined" color='black' sx={{ fontSize: 17, fontWeight: 500, textTransform: 'none' }}>
                Login
        </Button>
        </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{flexGrow:1, textAlign: 'left', px: 6, maxWidth: 1280}}>
      <Container sx={{ py: 6, marginTop: 20}}>
        <Grid container alignItems="center" spacing={3} maxWidth="false" sx={{ width: '100%', px: 0 }}>
            <Grid size="auto">
        <Typography variant="h2" fontWeight="bold"fontSize={90} marginTop={11}>
        <span style={{ color: '#003366' }}>Find your perfect</span> <br />
        <span style={{ color: '#4CAF50' }}>Capstone Team</span>
        </Typography>
        <Typography variant="body1" gutterBottom maxWidth={760} fontSize={30}>
        Swipe, Match, and Collaborate with your schoolmates who share your interest and compliment your skills. Build amazing projects together!
        </Typography>
        <Button variant="contained" sx={{ my: 2, textTransform: 'none', fontSize: 18, paddingInline: 3, backgroundColor: '#4CAF50'}}>
        <span style={{ color: '#FFFFFF' }}>Sign Up</span>
        </Button>
        </Grid>
        <Grid size="grow">
        <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: 90}}>
          <img
            src={groupImage}
            alt="team"
            style={{width: 'auto',
              height: '450px',
              maxWidth: 'none',
              objectFit: 'contain'}}
          />
        </Box>
      </Grid>
      </Grid>
      </Container>
      </Box>

      <Container id="how-it-works" sx={{ py: 6, marginTop: 20, scrollMarginTop: 130 }}>
        <Typography variant="h5" fontWeight="600" gutterBottom>
          HOW IT WORKS
        </Typography>
        <Typography variant="h2" fontWeight="bold" sx={{fontSize: 60}}>
        <span style={{ color: '#003366' }}>Find your dream team in 3 simple steps</span>
        </Typography>
        <Typography variant="subtitle1" fontWeight="300" gutterBottom sx={{fontSize: 23, maxWidth: 800, mx:'auto', marginTop: 3}}>
        <span style={{ color: 'black' }}>CapstoneConnect makes it easy to find teammates with complementary skills and interest</span>
        </Typography>
        </Container>

        <Box sx={{ width: '100%', px: 0}}> 
        <Container  maxWidth={false} sx={{ maxWidth: '1400px', marginTop: 6}}>
        <Grid container spacing={0} columns={24} sx={{maxHeight: 700}}>
          <Grid size={8}>
              <CardContent>
                <img src={Acc} alt="create-account"/>
                <Typography variant="h4" fontWeight="bold" fontSize={30} marginTop={2}>Create Your Profile</Typography>
                <Typography variant="body2" fontSize={18} fontWeight="100" marginTop={2}>
                Show case your skills, project interest, goals, and your previous projects
                </Typography>
              </CardContent>
          </Grid>
          <Grid size={8}>
              <CardContent>
              <img src={Swipe} alt="swiping"/>
                <Typography variant="h4" fontWeight="bold" fontSize={30} marginTop={2}>Swipe to Connect</Typography>
                <Typography variant="body2" fontSize={18} fontWeight="100" marginTop={2}>
                Browse through profiles and swipe right on students who you’d like to work with
                </Typography>
              </CardContent>
          </Grid>
          <Grid size={8}>
              <CardContent>
              <img src={Communicate} alt="comms"/>
                <Typography variant="h4" fontWeight="bold" fontSize={30} marginTop={2}>Connect & Collaborate</Typography>
                <Typography variant="body2" fontSize={18} fontWeight="100" marginTop={2}>
                  When there’s a mutual match, start chatting and planning your capstone project
                </Typography>
              </CardContent>
          </Grid>
        </Grid>
      </Container>
      </Box>

      <Container id="features" sx={{ py: 6, marginTop: 19, scrollMarginTop: 130}}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          FEATURES
        </Typography>
        <Typography variant="h2" fontWeight="bold" sx={{fontSize: 50}}>
        <span style={{ color: '#003366' }}>Everything you need to build your perfect team</span>
        </Typography>
        <Grid container spacing={3} columns={24} marginTop={13} justifyContent={'center'} gap={10}>
          <Grid size={6}>
            <Card className="real-time" variant="outlined" sx={{height: '100%',minHeight: 250, alignContent: 'center', borderRadius: 4,border: '1px solid #7390AE', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
              <CardContent sx={{textAlign: 'left'}}>
                <img src={Notify} alt="notify"/>
                <Typography variant="h6" sx={{marginTop: 1.5,  fontWeight: '600'}}>Real-time Notifications</Typography>
                <Typography variant="body2" sx={{marginTop: 1.5, maxWidth: 200}}>
                  Get notifiy instantly when you match someone or receive a message
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={6}>
            <Card className="mobile-friendly" variant="outlined" sx={{height: '100  %',minHeight: 250, alignContent: 'center',borderRadius: 4,border: '1px solid #7390AE', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
              <CardContent sx={{textAlign: 'left'}}>
              <img src={Mobile} alt="mobile"/>
                <Typography variant="h6" sx={{marginTop: 1.5,  fontWeight: '600'}}>Mobile Friendly</Typography>
                <Typography variant="body2" sx={{marginTop: 1.5, maxWidth: 230}}>
                  Find teammates on the go with our responsive, swipe-friendly interface
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={6}>
            <Card className="academic" variant="outlined" sx={{height: '100%',minHeight: 250, alignContent: 'center', borderRadius: 4,border: '1px solid #7390AE', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
              <CardContent sx={{textAlign: 'left'}}>
                <img src={Acad} alt="acad"/>
                <Typography variant="h6" sx={{marginTop: 1.5, fontWeight: '600'}}>Academic Focus</Typography>
                <Typography variant="body2" sx={{marginTop: 1.5, maxWidth: 230}}>
                  Built specifically for capstone project and academic collaboration
                </Typography>
              </CardContent>
            </Card>
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
    </>
  );
}
