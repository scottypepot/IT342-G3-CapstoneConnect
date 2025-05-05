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
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { ArrowBack, Edit, Add, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { API_URL } from '../config/api';

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
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('error');

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

  const PREFER_ROLES = [
    'Backend Developer',
    'Frontend Developer',
    'Mobile Developer',
    'Project Manager',
    'UI/UX Designer',
    'Technical Writer'
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

  const [roleAnchorEl, setRoleAnchorEl] = useState(null);
  const isRoleOpen = Boolean(roleAnchorEl);

  const [skillsAnchorEl, setSkillsAnchorEl] = useState(null);
  const isSkillsOpen = Boolean(skillsAnchorEl);

  const handleRoleOpen = (event) => {
    setRoleAnchorEl(event.currentTarget);
  };

  const handleRoleClose = () => {
    setRoleAnchorEl(null);
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    handleRoleClose();
  };

  const handleSkillsOpen = (event) => {
    setSkillsAnchorEl(event.currentTarget);
  };

  const handleSkillsClose = () => {
    setSkillsAnchorEl(null);
  };

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
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
    // Allow letters, spaces, periods, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z .'-]+$/;
    return nameRegex.test(name);
  };

  const validateGithubLink = (link) => {
    if (!link) return true; // Allow empty field
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)*\/?$/;
    const isValid = githubRegex.test(link);
    if (!isValid) {
      setToastMessage('Please enter a valid GitHub URL (e.g., https://github.com/capstoneconnect)');
      setToastSeverity('error');
      setToastOpen(true);
    }
    return isValid;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate fields
    if (field === 'fullName') {
      if (!validateName(value)) {
        setErrors(prev => ({ ...prev, fullName: 'Name can only contain letters, spaces, periods, hyphens, and apostrophes' }));
      } else {
        setErrors(prev => ({ ...prev, fullName: '' }));
      }
    }
    
    if (field === 'github') {
      validateGithubLink(value);
    }
  };

  const handleSave = async () => {
    try {
      // Validate before saving
      if (!validateName(formData.fullName)) {
        setToastMessage('Please enter a valid name (letters, spaces, periods, hyphens, and apostrophes only)');
        setToastSeverity('error');
        setToastOpen(true);
        return;
      }

      if (!validateGithubLink(formData.github)) {
        setToastSeverity('error');
        return; // The toast message is already set in validateGithubLink
      }

      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        setToastMessage('User session expired. Please log in again.');
        setToastSeverity('error');
        setToastOpen(true);
        return;
      }

      // Create the request body with proper formatting
      const requestBody = {
        fullName: formData.fullName || '',
        role: formData.role || '',
        about: formData.about || '',
        skills: Array.isArray(skills) ? skills : [],
        interests: Array.isArray(interests) ? interests : [],
        githubLink: formData.github || '',
        profilePicture: uploadedAvatarUrl || avatar || ''
      };

      const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        setToastMessage('Profile changes saved successfully!');
        setToastSeverity('success');
        setToastOpen(true);
        setTimeout(() => navigate('/profile'), 1200);
      } else {
        const errorData = await response.json();
        setToastMessage(errorData.message || 'Failed to update profile. Please try again.');
        setToastSeverity('error');
        setToastOpen(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setToastMessage('An error occurred while updating your profile. Please try again.');
      setToastSeverity('error');
      setToastOpen(true);
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
      formData.append("userId", sessionStorage.getItem("userId"));

      const response = await fetch(`${API_URL}/api/upload-profile-picture`, {
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

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests((prev) => prev.filter((item) => item !== interest));
    } else {
      setInterests((prev) => {
        if (prev.length < 4) {
          return [...prev, interest];
        } else {
          // Remove the first and add the new one
          const newSelection = prev.slice(1);
          return [...newSelection, interest];
        }
      });
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
            onClick={handleRoleOpen}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ExpandMore 
                    fontSize="small"
                    sx={{
                      transition: 'transform 0.2s',
                      transform: isRoleOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ fontStyle: 'italic' }}
            fullWidth
            readOnly
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
          placeholder="Write something about yourself"
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
            onClick={handleSkillsOpen}
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
              onDelete={() => toggleInterest(interest)}
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
            onClick={() => {
              if (interests.length >= 4) {
                setToastMessage('4 project interests only are allowed');
                setToastSeverity('error');
                setToastOpen(true);
              } else {
                setInterestsModalOpen(true);
              }
            }}
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
        anchorEl={skillsAnchorEl}
        open={isSkillsOpen}
        onClose={handleSkillsClose}
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
                  onClick={() => toggleInterest(interest)}
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
          <Button variant="contained" onClick={() => setInterestsModalOpen(false)} sx={{ mt: 4, backgroundColor: 'white', color: 'black', '&:hover': { backgroundColor: '#d9d9d9' } }}>
            Save Interests
          </Button>
        </Box>
      </Modal>

      {/* Role Menu */}
      <Menu
        anchorEl={roleAnchorEl}
        open={isRoleOpen}
        onClose={handleRoleClose}
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
        {PREFER_ROLES.map((role) => (
          <MenuItem
            key={role}
            selected={formData.role === role}
            onClick={() => handleRoleSelect(role)}
            sx={{
              backgroundColor: formData.role === role ? '#444' : 'transparent',
              '&:hover': {
                backgroundColor: '#555',
              },
            }}
          >
            {role}
          </MenuItem>
        ))}
      </Menu>

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setToastOpen(false)} 
          severity={toastSeverity}
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
