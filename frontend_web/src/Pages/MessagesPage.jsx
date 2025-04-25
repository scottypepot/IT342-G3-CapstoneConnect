import React, { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button
} from '@mui/material';
import { Helmet } from 'react-helmet';
import Navbar from '../Pages/NavBar';
import { useNavigate } from 'react-router-dom';

// Simulated storage (replace with real state management or backend integration)
const getConnectedMatches = () =>
  JSON.parse(localStorage.getItem('matches')) || [];

export default function MessagesPage() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setMatches(getConnectedMatches());
  }, []);

  return (
    <>

      <Helmet>
        <title>CapstoneConnect - Messages</title>
        <meta name="description" content="Chat with your matched teammates" />
      </Helmet>

      <Box sx={{ backgroundColor: '#EEECEC', minHeight: '100vh', overflow: 'hidden' }}>
        <Navbar />

        <Typography
          variant="h4"
          fontWeight="bold"
          color="#4CAF50"
          sx={{
            mt: { xs: 8, sm: 20, md: 19, lg: 23 },
            pl: { xs: 2, sm: 5, md: 10, lg: 35 },
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem', lg: '2rem' },
          }}
        >
          Messages
        </Typography>

        <Container sx={{ width: '100%', mt: 3 }}>
          {matches.length ? (
            <List sx={{ maxWidth: 800, mx: 'auto' }}>
              {matches.map((match, idx) => (
                <ListItem
                  key={idx}
                  alignItems="flex-start"
                  sx={{ bgcolor: '#fff', mb: 2, borderRadius: 2, cursor: 'pointer' }}
                  onClick={() => navigate(`/chat/${match.id || idx}`)}
                >
                  <ListItemAvatar>
                    <Avatar alt={match.fullName} src={match.avatar} />
                  </ListItemAvatar>

                  <ListItemText
                    primary={match.fullName}
                    secondary="Hey! Would love to connect and collaborate — no pressure, just good ideas and good vibes. Let’s build something awesome. 🙌"
                    slotProps={{
                      primary: {
                        sx: { fontWeight: 'bold', fontSize: '1rem' },
                      },
                      secondary: {
                        sx: { fontSize: '0.9rem', color: 'gray' },
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 3,
              }}
            >
              <img
                src="/croplogo.png"
                alt="No Matches"
                style={{ maxWidth: '200px', marginBottom: 2, marginTop: 110 }}
              />
              <Typography variant="h4" fontWeight="bold" color="#003366" sx={{ mt: 3 }}>
                You Don’t Have Any Matches Yet!
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: 400,
                  color: '#000',
                  textAlign: 'center',
                  fontSize: 17,
                  mt: 1,
                }}
              >
                Keep swiping! Your future capstone teammate is just around the corner.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
