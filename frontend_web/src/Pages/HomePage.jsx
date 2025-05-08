import React, { useState, useRef, useEffect } from 'react';
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
import { getAuthenticatedUser } from "./authService";
import { API_URL } from '../config/api';

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
        width: 350,
        height: 450,
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
            width: 350,
            height: 450,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={profile.profilePicture}
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
            {profile.skills && profile.skills.length ? (
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
            {profile.interests && profile.interests.length ? (
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
            {profile.githubLink ? (
              <a href={profile.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0077cc' }}>
                {profile.githubLink}
              </a>
            ) : 'No GitHub link provided.'}
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" gap={4} mt={3}>
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
            alt="Pass"
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
            alt="Connect"
            style={{ width: '90%', height: '90%' }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default function HomePage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeHomePage = async () => {
      try {
        // First, get the authenticated user
        const user = await getAuthenticatedUser();
        if (!user) {
          console.error("No authenticated user found");
          navigate('/'); // Redirect to landing page if no user
          return;
        }

        // Check if first time user
        if (user.firstTimeUser) {
          setShowWelcomeModal(true);
        }

        // Then fetch potential matches using the user ID
        const response = await fetch(`${API_URL}/api/users/${user.id}/potential-matches`, {
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          setProfiles(data);
        } else {
          console.error("Failed to fetch potential matches");
        }
      } catch (error) {
        console.error("Error initializing home page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeHomePage();
  }, [navigate]);

  const handleSwipeLeft = async () => {
    const profile = profiles[currentIndex];
    try {
      const userId = sessionStorage.getItem("userId");
      // Call backend to set match status to PASSED (3-hour cooldown)
      const response = await fetch(`${API_URL}/api/matches/${userId}_${profile.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "PASSED",
          userId: userId
        })
      });
      if (!response.ok) {
        console.error("Failed to set pass/cooldown");
      }
    } catch (error) {
      console.error("Error setting pass/cooldown:", error);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeRight = async () => {
    const profile = profiles[currentIndex];
    try {
      const userId = sessionStorage.getItem("userId");
      const response = await fetch(`${API_URL}/api/users/${userId}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          matchedUserId: profile.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Show success message or notification
        console.log("Match request sent:", result.message);
      } else {
        console.error("Failed to save match");
      }
    } catch (error) {
      console.error("Error saving match:", error);
    }

    setCurrentIndex(prev => prev + 1);
  };
  
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
            mt: { xs: 15, sm: 20, md: 8 },
            ml: { xs: 2, sm: 6, md: 40 },
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
          {isLoading ? (
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5E6062' }}>
              Loading profiles...
            </Typography>
          ) : currentIndex < profiles.length ? (
            <SwipeCard
              profile={profiles[currentIndex]}
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
