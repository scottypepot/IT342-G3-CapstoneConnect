import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Chip,
  InputAdornment,
  AppBar,
  Toolbar
} from '@mui/material';
import { ArrowBack, Edit, Add, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
export default function EditProfilePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: 'Gitgano, Scott Benzer',
    role: 'Frontend Developer',
    about:
      "I'm a Frontend Developer specializing in JavaScript and ReactJS, building sleek, user-friendly interfaces with a strong focus on performance, responsiveness, and modern design.",
    github: 'https://github.com/vyn23232',
  });

  const [skills, setSkills] = useState(['Java', 'JavaScript', 'UI/UX Design', 'Figma', 'C#']);
  const [interests, setInterests] = useState([
    'Mobile Development',
    'Collaboration',
    'Working on Projects',
    'Learning new Skills',
  ]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ p: 5, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
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

      {/* Profile Picture and Info */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={15}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src="/profile-placeholder.png"
            sx={{ width: 100, height: 100, border: '2px solid #ccc' }}
          />
          <IconButton
            sx={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white' }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Box>

        <Box textAlign="center" mt={2}>
          <TextField
            value={formData.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Edit fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ fontSize: 20, fontWeight: 'bold', mb: 1 }}
            fullWidth
          />
          <TextField
            value={formData.role}
            onChange={e => handleChange('role', e.target.value)}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Edit fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ fontStyle: 'italic' }}
            fullWidth
          />
        </Box>
      </Box>

      {/* About Section */}
      <Box mt={4}>
        <Typography fontWeight="bold" color="#1a1a1a">
          About:
        </Typography>
        <TextField
          value={formData.about}
          onChange={e => handleChange('about', e.target.value)}
          fullWidth
          multiline
          minRows={3}
          sx={{ mt: 1, backgroundColor: 'white', borderRadius: 1 }}
        />
      </Box>

      {/* Skills Section */}
      <Box mt={4}>
        <Typography fontWeight="bold" color="#1a1a1a">
          Skills:
        </Typography>
        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
          {skills.map(skill => (
            <Chip key={skill} label={skill} sx={{ backgroundColor: '#e0e0e0' }} />
          ))}
          <IconButton size="small" sx={{ backgroundColor: '#ccc' }}>
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Interests Section */}
      <Box mt={4}>
        <Typography fontWeight="bold" color="#1a1a1a">
          Interest:
        </Typography>
        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
          {interests.map(interest => (
            <Chip key={interest} label={interest} sx={{ backgroundColor: '#d0e8ff' }} />
          ))}
          <IconButton size="small" sx={{ backgroundColor: '#ccc' }}>
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* GitHub Section */}
      <Box mt={4}>
        <Typography fontWeight="bold" color="#1a1a1a">
          Github Link:
        </Typography>
        <TextField
          fullWidth
          value={formData.github}
          onChange={e => handleChange('github', e.target.value)}
          sx={{ mt: 1, backgroundColor: 'white', borderRadius: 1 }}
        />
      </Box>
    </Box>
  );
}
