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
  Toolbar,
  Modal
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

  const handleSkillSelect = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    } else {
      setSkills(skills.filter((s) => s !== skill));
    }
  };

  const handleInterestSelect = (interest) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    } else {
      setInterests(interests.filter((i) => i !== interest));
    }
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
            onClick={() => setSkillsModalOpen(true)}
          >
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
            <Chip 
              key={interest} 
              label={interest} 
              onDelete={() => handleInterestSelect(interest)}
              sx={{ backgroundColor: '#00C1A0' }} 
            />
          ))}
          <IconButton 
            size="small" 
            sx={{ backgroundColor: '#ccc' }}
            onClick={() => setInterestsModalOpen(true)}
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
      <Modal open={skillsModalOpen} onClose={() => setSkillsModalOpen(false)}>
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
            Skills
          </Typography>
          <Box sx={{ textAlign: 'left', width: '100%', ml: 20}}>
            <Typography variant="subtitle1" sx={{ fontSize: 16, color: 'white' }}>
              Select your skills
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
            }}
          >
            {SKILLS.map((skill) => {
              const isSelected = skills.includes(skill);
              return (
                <Box
                  key={skill}
                  onClick={() => handleSkillSelect(skill)}
                  sx={{
                    width: 300,
                    height: 45,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isSelected ? '#FFD700' : 'grey.400',
                    backgroundColor: isSelected ? '#FFD700' : '#577058',
                    color: isSelected ? 'black' : 'white',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: isSelected ? '#FFD700' : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  {skill}
                </Box>
              );
            })}
          </Box>

          <Button 
            variant="contained" 
            onClick={() => setSkillsModalOpen(false)}
            sx={{ 
              mt: 4,
              backgroundColor: '#0C4278',
              color: 'white',
              '&:hover': {
                backgroundColor: '#0C4278',
              },
            }}
          >
            Save Skills
          </Button>
        </Box>
      </Modal>

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
                    borderColor: isSelected ? '#00C1A0' : 'grey.400',
                    backgroundColor: isSelected ? '#00C1A0' : '#577058',
                    color: isSelected ? 'black' : 'white',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: isSelected ? '#00C1A0' : 'rgba(0,0,0,0.05)',
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
              backgroundColor: '#0C4278',
              color: 'white',
              '&:hover': {
                backgroundColor: '#0C4278',
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
