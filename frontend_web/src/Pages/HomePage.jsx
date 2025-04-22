import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Logo from '../assets/logo.png';
import WelcomeModal from '../Pages/WelcomeModal';
import ConnectIcon from '../assets/connecticon.png';
import PassIcon from '../assets/passicon.png';
import Navbar from '../Pages/NavBar';

// Mock data (replace with real data from backend)
const mockProfiles = [
  {
    fullName: 'Jane Doe',
    role: 'Frontend Developer',
    avatar: 'https://via.placeholder.com/400x250',
    about: 'Passionate about UI/UX design and accessibility.',
    skills: ['React', 'CSS', 'Figma'],
    interests: ['Design', 'Frontend', 'Accessibility'],
    githublink: 'https://github.com/janedoe'
  },
  {
    fullName: 'John Smith',
    role: 'Backend Developer',
    avatar: 'https://via.placeholder.com/400x250',
    about: 'Loves working with APIs and databases.',
    skills: ['Node.js', 'Express', 'MongoDB'],
    interests: ['Databases', 'REST APIs', 'Security'],
    githublink: 'https://github.com/johnsmith'
  }
];

const SwipeCard = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [position, setPosition] = useState({ x: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setPosition({ x: deltaX });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (position.x < -100) {
      onSwipeLeft();
    } else if (position.x > 100) {
      onSwipeRight();
    }
    setPosition({ x: 0 });
  };

  return (
    
    <Box
      ref={cardRef}
      sx={{
        width: 400,
        height: 500,
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: `translate(-50%, 0) translateX(${position.x}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        zIndex: 10,
        cursor: 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
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
        <Box
          sx={{
            width: 400,
            height: 500,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={profile.avatar}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              {profile.fullName}
            </Typography>
            <Typography variant="subtitle2">{profile.role}</Typography>
          </Box>
        </Box>

        <Box sx={{ px: 3, pt: 2, pb: 4 }}>
          <Typography variant="h6" fontWeight="bold">About Me</Typography>
          <Box mt={1} mb={2}>{profile.about || 'No information provided.'}</Box>

          <Typography variant="h6" fontWeight="bold">Skills</Typography>
          <Box mt={1} mb={2} display="flex" flexWrap="wrap" gap={1}>
            {profile.skills.length ? (
              profile.skills.map(skill => (
                <Box key={skill} sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 3,
                  backgroundColor: '#FFD700',
                  color: 'black',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                }}>{skill}</Box>
              ))
            ) : 'No skills listed.'}
          </Box>

          <Typography variant="h6" fontWeight="bold">Interests</Typography>
          <Box mt={1} mb={2} display="flex" flexWrap="wrap" gap={1}>
            {profile.interests.length ? (
              profile.interests.map((i, idx) => (
                <Box key={i + idx} sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 3,
                  backgroundColor: '#00C1A0',
                  color: 'black',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                }}>{i}</Box>
              ))
            ) : 'No interests listed.'}
          </Box>

          <Typography variant="h6" fontWeight="bold">GitHub</Typography>
          <Box mt={1}>
            {profile.githublink ? (
              <a href={profile.githublink} target="_blank" rel="noopener noreferrer" style={{ color: '#0077cc' }}>
                {profile.githublink}
              </a>
            ) : 'No GitHub link provided.'}
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" gap={4} mt={3} >
    <IconButton
      onClick={onSwipeLeft}
      sx={{
        bgcolor: '#c0392b',
        color: 'white',
        width: 70,
        height: 70,
        '&:hover': {
          bgcolor: '#B93434',
        },
      }}
    >
      <img
      src={PassIcon}
      alt="Like"
      style={{ width: '90%', height: '90%' }}
    />
    </IconButton>
    <IconButton
      onClick={onSwipeRight}
      sx={{
        bgcolor: '#4CAF50',
        color: 'white',
        width: 70,
        height: 70,
        '&:hover': {
          bgcolor: '#27ae60',
        },
      }}
    >
      <img
      src={ConnectIcon}
      alt="Like"
      style={{ width: '90%', height: '90%' }}
    />
    </IconButton>
  </Box>
    </Box>
  );
};

export default function HomePage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleSwipeLeft = () => setCurrentIndex(prev => prev + 1);
  const handleSwipeRight = () => setCurrentIndex(prev => prev + 1);

  return (
    <>
      <Helmet>
        <title>CapstoneConnect - Find Your Perfect Team</title>
        <meta name="description" content="Swipe, match and collaborate with classmates" />
      </Helmet>

      <Box sx={{ backgroundColor: '#EEECEC', minHeight: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <Toolbar />

        <WelcomeModal open={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mt: { xs: 15, sm: 20, md: 13 },
            ml: {  xs: 2, sm: 6, md: 40 },
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            <span style={{ color: '#003366' }}>Find</span>{' '}
            <span style={{ color: '#4CAF50' }}>Teammates</span>
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 550,
            mt: 6,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {currentIndex < mockProfiles.length ? (
            <SwipeCard
              profile={mockProfiles[currentIndex]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          ) : (
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5E6062' }}>
              No more profiles to show.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
