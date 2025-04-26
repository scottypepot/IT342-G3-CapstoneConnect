import React, { useState, useEffect, useRef } from 'react';
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
  const fileInputRef = useRef();
  
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    about: '',
    github: '',
  });

  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState("");

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const response = await fetch(`http://localhost:8080/api/users/${userId}/profile`, {
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            fullName: data.fullName || '',
            role: data.role || '',
            about: data.about || '',
            github: data.githubLink || '',
          });
          setSkills(data.skills || []);
          setInterests(data.interests || []);
          setAvatar(data.profilePicture || '/profile-placeholder.png');
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/users/${userId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: formData.fullName,
          role: formData.role,
          about: formData.about,
          skills,
          interests,
          githubLink: formData.github,
          profilePicture: uploadedAvatarUrl || avatar,
        }),
      });

      if (response.ok) {
        navigate('/profile');
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8080/api/upload-profile-picture", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedAvatarUrl(data.fileUrl);
      } else {
        console.error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

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
            src={avatar}
            sx={{ width: 100, height: 100, border: '2px solid #ccc' }}
          />
          <IconButton
            onClick={() => fileInputRef.current.click()}
            sx={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white' }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
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

      {/* Add Save Button */}
      <Box mt={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: '#003366',
            color: 'white',
            '&:hover': {
              backgroundColor: '#002244',
            },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}
