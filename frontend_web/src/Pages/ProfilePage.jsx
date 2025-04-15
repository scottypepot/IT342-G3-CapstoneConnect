import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import Logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  
  // State to store user data from welcome modal
  // Using the same data structure as in the welcome modal case 5
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    about: '',
    githublink: ''
  });
  
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [avatar, setAvatar] = useState('');

  // Load user data from localStorage that was saved during welcome modal
  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    const savedSkills = localStorage.getItem('skills');
    const savedInterests = localStorage.getItem('interests');
    const savedAvatar = localStorage.getItem('avatar');
    
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
    if (savedInterests) {
      setInterests(JSON.parse(savedInterests));
    }
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>CapstoneConnect - Your Profile</title>
        <meta name="description" content="Manage your CapstoneConnect profile" />
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
        

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: 40, // same as ml/mr below to align with the card
          mt: 20 
        }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#003366', fontSize: 28 }}>
              Profile
            </Typography>
            <Typography variant="body1" sx={{ color: '#5E6062', cursor: 'pointer', fontSize: 28 }}
            onClick={() => navigate('/edit-profile')} // change path as needed
            >
              Edit Profile
            </Typography>
        </Box>

        {/* Profile Content */}
        <Box
              sx={{
                mt: 15,
                ml: 15,
                mr: 15,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
        
              {/* Profile box centered */}
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Box
                  sx={{
                    width: 400,
                    height: 500,
                    overflowY: 'auto',
                    borderRadius: 5,
                    boxShadow: 4,
                    bgcolor: '#fff',
                    color: 'black',
                    textAlign: 'left',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {/* Profile Image and Basic Info */}
                  <Box
                    sx={{
                      width: 400,
                      height: 500,
                      m: 'auto',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={avatar}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {formData.fullName || 'No Name'}
                      </Typography>
                      <Typography variant="subtitle2">
                        {formData.role || 'No Preferred Role'}
                      </Typography>
                    </Box>
                  </Box>
        
                  {/* Additional Info */}
                  <Box sx={{ px: 3, pt: 2, pb: 4 }}>
                    <Typography variant="h6" fontWeight="bold">About Me</Typography>
                    <Box mt={1} mb={2}>
                      {formData.about || 'No information provided.'}
                    </Box>
        
                    <Typography variant="h6" fontWeight="bold">Skills</Typography>
                    <Box mt={1} mb={2} display="flex" flexWrap="wrap" gap={1}>
                      {skills.length > 0 ? (
                        skills.map(skill => (
                          <Box
                            key={skill}
                            sx={{
                              px: 2,
                              py: 0.5,
                              borderRadius: 3,
                              backgroundColor: '#FFD700',
                              color: 'black',
                              fontWeight: 500,
                              fontSize: '0.85rem',
                            }}
                          >
                            {skill}
                          </Box>
                        ))
                      ) : (
                        'No skills selected.'
                      )}
                    </Box>
        
                    <Typography variant="h6" fontWeight="bold">Interests</Typography>
                      <Box
                        mt={1}
                        mb={2}
                        display="flex"
                        flexWrap="wrap"
                        gap={1}
                        >
                      {interests.length > 0 ? (
                          interests.map((interest, index) => (
                        <Box
                            key={interest + index}
                            sx={{
                            width: '48%', // slightly less than 50% to account for gap
                            px: 2,
                            py: 0.5,
                            borderRadius: 3,
                            backgroundColor: '#00C1A0',
                            color: 'black',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            boxSizing: 'border-box',
                          }}
                        >
                        {interest}
                      </Box>
                      ))
                      ) : (
                        'No interests selected.'
                      )}
                    </Box>
                    
                    <Typography variant="h6" fontWeight="bold">GitHub</Typography>
                    <Box mt={1}>
                      {formData.githublink ? (
                        <a
                          href={formData.githublink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#0077cc' }}
                        >
                          {formData.githublink}
                        </a>
                      ) : (
                        'No GitHub link provided.'
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
      </Box>
    </>
  );
}