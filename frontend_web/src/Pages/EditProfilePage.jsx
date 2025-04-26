import React, { useState, useEffect, useRef } from 'react';
import Navbar from './NavBar';
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
  Toolbar,
  Modal,
  Menu,
  MenuItem  
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

  const [errors, setErrors] = useState({
    fullName: '',
    github: '',
  });

  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState("");
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);

  const SKILLS = [
    'JavaScript',
    'Python',
    'Java',
    'C++',
    'React',
    'Node.js',
    'UI/UX Design',
    'Database Management',
    'Machine Learning',
    'Mobile Development'
  ];

  const INTERESTS = [
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Artificial Intelligence',
    'Software Development',
    'Chatbots',
    'Cybersecurity',
    'UI/UX Design'
  ];
  const [anchorEl, setAnchorEl] = useState(null); // anchor for dropdown

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const isOpen = Boolean(anchorEl);

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

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(name);
  };

  const validateGithubLink = (link) => {
    if (!link) return true; // Allow empty github link
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/?$/;
    return githubRegex.test(link);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate fields
    if (field === 'fullName') {
      if (!validateName(value)) {
        setErrors(prev => ({ ...prev, fullName: 'Name can only contain letters and spaces' }));
      } else {
        setErrors(prev => ({ ...prev, fullName: '' }));
      }
    }
    
    if (field === 'github') {
      if (!validateGithubLink(value)) {
        setErrors(prev => ({ ...prev, github: 'Please enter a valid GitHub profile URL (e.g., https://github.com/username)' }));
      } else {
        setErrors(prev => ({ ...prev, github: '' }));
      }
    }
  };

  const handleSave = async () => {
    // Validate before saving
    if (!validateName(formData.fullName) || !validateGithubLink(formData.github)) {
      return;
    }

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

  const handleSkillSelect = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    } else {
      setSkills(skills.filter((s) => s !== skill));
    }
  };

  const handleInterestSelect = (interest) => {
    if (!interests.includes(interest)) {
      if (interests.length >= 4) {
        // Don't add more than 4 interests
        return;
      }
      setInterests([...interests, interest]);
    } else {
      setInterests(interests.filter((i) => i !== interest));
    }
  };

  return (
    <Box sx={{ p: 5, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
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
            error={!!errors.fullName}
            helperText={errors.fullName}
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
            <Chip 
              key={skill} 
              label={skill} 
              onDelete={() => handleSkillSelect(skill)}
              sx={{ backgroundColor: '#FFD700' }} 
            />
          ))}
          <IconButton 
            size="small" 
            sx={{ backgroundColor: '#ccc' }}
            onClick={handleOpen}
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Interests Section */}
      <Box mt={4}>
        <Typography fontWeight="bold" color="#1a1a1a">
          Interests:
        </Typography>
        {interests.length < 4 && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: 'left', ml: 2, color: 'red' }}>
            {4 - interests.length} selections remaining
          </Typography>
        )}
        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
          {interests.map(interest => (
            <Chip 
              key={interest} 
              label={interest} 
              onDelete={() => handleInterestSelect(interest)}
              sx={{ backgroundColor: '#00C1A0' }} 
            />
          ))}
          <IconButton 
            size="small" 
            sx={{ 
              backgroundColor: '#ccc',
              opacity: interests.length >= 4 ? 0.5 : 1,
              cursor: interests.length >= 4 ? 'not-allowed' : 'pointer'
            }}
            onClick={() => interests.length < 4 && setInterestsModalOpen(true)}
          >
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
          error={!!errors.github}
          helperText={errors.github}
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

      {/* Skills Modal */}
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          sx: {
            bgcolor: '#222',
            color: 'white',
            mt: 1,
          },
        }}
      >
        {SKILLS.map((skill) => (
          <MenuItem
            key={skill}
            selected={skills.includes(skill)}
            onClick={() => handleSkillSelect(skill)}
            sx={{
              backgroundColor: skills.includes(skill) ? '#444' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
              },
            }}
          >
            {skill}
          </MenuItem>
        ))}
      </Menu>

      {/* Interests Modal */}
      <Modal open={interestsModalOpen} onClose={() => setInterestsModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 900,
            height: 600,
            bgcolor: '#2E2F44',
            borderRadius: 2,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='subtitle1' sx={{textAlign: 'center',fontSize: 30, color: '#4CAF50', fontWeight: 600, borderBottom: '2px solid white', width: '100%'}}>
            Interests
          </Typography>
          <Box sx={{ textAlign: 'left', width: '100%', ml: 20}}>
            <Typography variant="subtitle1" sx={{ fontSize: 16, color: 'white' }}>
              You can choose 4 interests
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
            }}
          >
            {INTERESTS.map((interest) => {
              const isSelected = interests.includes(interest);
              return (
                <Box
                  key={interest}
                  onClick={() => handleInterestSelect(interest)}
                  sx={{
                    width: 300,
                    height: 45,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isSelected ? '#00645C' : 'grey.400',
                    backgroundColor: isSelected ? '#00645C' : '#577058',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: isSelected ? '#004F47' : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  {interest}
                </Box>
              );
            })}
          </Box>

          <Button 
            variant="contained" 
            onClick={() => setInterestsModalOpen(false)}
            sx={{ 
              mt: 4,
              backgroundColor: 'white',
              color: 'black',
              '&:hover': {
                backgroundColor: '#d9d9d9'
              },
            }}
          >
            Save Interests
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
