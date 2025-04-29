import React, { useState, useRef, useEffect } from 'react';
import { getAuthenticatedUser } from "./authService";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Avatar,
    IconButton,
    Input,
    Select,
    MenuItem,
    Checkbox,
    List,
    ListItem,
    OutlinedInput,
    ListItemText,
    Menu,
    Snackbar,
    Alert
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { API_URL } from '../config/api';

const steps = [
    {
      title: 'Welcome to CapstoneConnect!',
      subtitle: 'Find Teammates',
      description: 'Connect with students who share your goals',
    },
    {
      title: 'Welcome to CapstoneConnect!',
      subtitle: 'Chat Instantly',
      description: 'After you match with students, communicate with them for team collaboration',
    },
    {
      title: 'Welcome to CapstoneConnect!',
      subtitle: 'Update your Profile',
      description: 'Update your Profile',
    },
    {
      title: 'Welcome to CapstoneConnect!',
      subtitle: 'Update your Profile',
      description: 'Upload your Profile Picture',
    },
    {
      title: 'Welcome to CapstoneConnect!',
      subtitle: 'Update your Profile',
      description: 'Fill out your information below',
    },
    {
      title: 'Congrats! You have completed the first step!',
      subtitle: '',
      description: 'You can now connect with other students!',
    },
  ];
  
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
  function InterestsModal({ open, onClose, selectedInterests, setSelectedInterests }) {
    const toggleInterest = (interest) => {
      if (selectedInterests.includes(interest)) {
        setSelectedInterests((prev) =>
          prev.filter((item) => item !== interest)
        );
      } else {
        setSelectedInterests((prev) => {
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
      <Modal open={open} onClose={onClose}>
        
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
      Interest
    </Typography>
    <Box sx={{ textAlign: 'left', width: '100%', ml: 20}}>
      <Typography variant="subtitle1" sx={{ fontSize: 16 }}>
        You can choose 4 interest
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
        const isSelected = selectedInterests.includes(interest);
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

    <Button variant="contained" onClick={onClose} sx={{ mt: 4 }}>
      Save Interests
    </Button>
  </Box>
</Modal>
    );
  }
export default function WelcomeModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [resume, setResume] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    skills: '',
    githublink: '',
  });
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [skillsAnchorEl, setSkillsAnchorEl] = useState(null);
  const [githubError, setGithubError] = useState('');
  const [roleAnchorEl, setRoleAnchorEl] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('error');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const user = await getAuthenticatedUser();
            if (user) {
                console.log("✅ User authenticated:", user);
                setFormData((prev) => ({
                    ...prev,
                    fullName: user.name || '',
                    role: user.role || '',
                    about: user.about || '',
                    skills: user.skills || [],
                    interests: user.interests || [],
                    githubLink: user.githubLink || "",
                    profilePicture: user.profilePicture || "",
                }));
            }
        } catch (error) {
            console.error("❌ Failed to fetch user data:", error);
        }
    };
    fetchUserData();
}, []);

  const fileInputRef = useRef();
  const handleNext = () => {
    // If we're on the step with GitHub input, validate it first
    if (step === 3 && formData.githublink) {
      const isValid = validateGithubLink(formData.githublink);
      if (!isValid) {
        return; // Don't proceed if invalid
      }
    }

    // Validate name field
    if (step === 3 && !validateName(formData.fullName)) {
      return;
    }

    // Validate required fields before proceeding
    if (step === 3 && !validateRequiredFields()) {
      return;
    }

    setStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState("");
  const handleFinish = async () => {
    try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            console.error("❌ User ID is missing. Cannot update profile.");
            return;
        }

        // Ensure we have a valid profile picture URL
        const profilePictureUrl = uploadedAvatarUrl || "/uploads/default-avatar.png";

        // Update user profile
        const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                fullName: formData.fullName,
                role: formData.role,
                about: formData.about,
                skills,
                interests,
                githubLink: formData.githublink,
                profilePicture: profilePictureUrl,
            }),
        });

        if (response.ok) {
            // Update firstTimeUser status
            await fetch(`${API_URL}/api/users/${userId}/first-time`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    firstTimeUser: false
                }),
            });
            
            setToastMessage('Profile setup complete! Find your potential matches now!');
            setToastSeverity('success');
            setToastOpen(true);
            setTimeout(() => onClose(), 1200);
        } else {
            console.error("❌ Failed to update profile");
        }
    } catch (error) {
        console.error("❌ Error updating profile:", error);
    }
  };

const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) {
      console.error("❌ No file selected.");
      return;
  }

  // Optional: show preview (but don't save to state for submission)
  const previewUrl = URL.createObjectURL(file);
  setAvatar(previewUrl); // Show it visually only

  try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/upload-profile-picture`, {
          method: "POST",
          body: formData,
          credentials: 'include',
          headers: {
          },
      });

      if (response.ok) {
          const data = await response.json();
          console.log("✅ File uploaded successfully:", data);
          setUploadedAvatarUrl(data.fileUrl);
      } else {
          console.error("❌ Failed to upload file. Status:", response.status);
          const errorText = await response.text();
          console.error("Error details:", errorText);
      }
  } catch (error) {
      console.error("❌ Error uploading file:", error);
  }
};

  const handleResumeChange = (e) => {
    setResume(e.target.files[0].name);
  };

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

  const isRoleOpen = Boolean(roleAnchorEl);

  const isSkillsOpen = Boolean(skillsAnchorEl);

  const handleSkillsOpen = (event) => {
    setSkillsAnchorEl(event.currentTarget);
  };

  const handleSkillsClose = () => {
    setSkillsAnchorEl(null);
  };

  const handleSkillSelect = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    } else {
      setSkills(skills.filter((s) => s !== skill));
    }
  };

  const validateGithubLink = (link) => {
    if (!link) return true; // Allow empty field
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)*\/?$/;
    return githubRegex.test(link);
  };

  const validateName = (name) => {
    // Check for URL patterns
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    if (urlPattern.test(name)) {
      setNameError('URLs are not allowed in the name field');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateRequiredFields = () => {
    if (!formData.role) {
      setToastMessage('Please select your preferred role');
      setToastSeverity('error');
      setToastOpen(true);
      return false;
    }
    if (!formData.about) {
      setToastMessage('Please fill out the About you section');
      setToastSeverity('error');
      setToastOpen(true);
      return false;
    }
    if (skills.length === 0) {
      setToastMessage('Please select at least one skill');
      setToastSeverity('error');
      setToastOpen(true);
      return false;
    }
    if (interests.length === 0) {
      setToastMessage('Please select at least one interest');
      setToastSeverity('error');
      setToastOpen(true);
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value || ''
    }));
    
    if (name === 'githublink') {
      const isValid = validateGithubLink(value);
      if (!isValid && value) {
        setToastMessage('Please enter a valid GitHub URL (e.g., https://github.com/capstoneconnect)');
        setToastOpen(true);
      }
    }

    if (name === 'fullName') {
      validateName(value);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
      case 1:
        return (
            <Box mt={16} textAlign="left">
            <Typography
              variant="h3"
              sx={{ color: 'white', fontWeight: 600, ml: 16}}
            >
              {steps[step].subtitle}
            </Typography>
            {steps[step].description && (
              <Typography
                variant="h6"
                sx={{ color: 'white', mt: 10,ml: 16, fontSize: 30, maxWidth: 900 }}
              >
                {steps[step].description}
              </Typography>
            )}
          </Box>
        );
        case 2:
  return (
    <Box sx={{
      mt: 5,
      ml: 15,
      mr: 15,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Left-aligned title */}
      <Typography
        variant="h3"
        sx={{ 
          color: 'white', 
          fontWeight: 600, 
          textAlign: 'left',
          mb: 6,
          fontSize: '2.5rem',
          width: '100%'
        }}
      >
        {steps[step].subtitle}
      </Typography>
      
      {/* Centered photo upload container */}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
  <Box
    component="label"
    sx={{
      width: 280,
      height: 380,
      borderRadius: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: avatar ? 'transparent' : '#eef6f6',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
      boxShadow: 3,
      '&:hover .change-overlay': {
        opacity: 1,
      },
    }}
  >
    {avatar ? (
      <>
        <img
          src={avatar}
          alt="Profile preview"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 20,
          }}
        />
        <Box
          className="change-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 500,
          }}
        >
          Change Photo
        </Box>
      </>
    ) : (
      <Button
            onClick={() => fileInputRef.current.click()}
            variant="contained"
            sx={{
              backgroundColor: '#add8f7',
              color: '#000',
              fontStyle: 'italic',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#92c8e9',
              },
            }}
          >
            Upload your Photo
          </Button>
        )}
    <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
  </Box>
</Box>
    </Box>
  );
        case 3:
            return (
              <Box mt={3} display="flex" flexDirection="column" gap={2} sx={{mt: 9}}>
                <TextField
                  name="fullName"
                  label="Your Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={!!nameError}
                  helperText={nameError}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#ff4444',
                    }
                  }}
                />
                {formData.role ? (
                  <Box
                    onClick={handleRoleOpen}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      border: '1px solid white',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        border: '1px solid #6bd5ce',
                        backgroundColor: '#6bd5ce',
                        color: 'black',
                        fontWeight: 500,
                        fontSize: '1rem',
                      }}
                    >
                      {formData.role}
                    </Box>
                    <IconButton
                      onClick={handleRoleOpen}
                      sx={{ color: 'white', ml: 1 }}
                    >
                      <AddIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    onClick={handleRoleOpen}
                    sx={{
                      border: '1px solid white',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    Select your preferred role
                    <AddIcon sx={{ color: 'white' }} />
                  </Box>
                )}

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

                <TextField
                  name="about"
                  label="About you"
                  value={formData.about}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    }
                  }}
                />
                {skills.length > 0 ? (
        <Box
          onClick={handleSkillsOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            border: '1px solid white',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {skills.map((skill) => (
              <Box
                key={skill}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 3,
                  border: '1px solid #FFD700',
                  backgroundColor: '#FFD700',
                  color: 'black',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                }}
              >
                {skill}
              </Box>
            ))}
          </Box>
          <IconButton
            onClick={handleSkillsOpen}
            sx={{ color: 'white', ml: 1 }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={handleSkillsOpen}
          sx={{
            border: '1px solid white',
            borderRadius: '8px',
            padding: '12px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          Select your skills
          <AddIcon sx={{ color: 'white' }} />
        </Box>
      )}

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

                {interests.length === 0 ? (
  <Button 
    variant="outlined" 
    onClick={() => {
      if (interests.length >= 4) {
        setToastMessage('4 project interests only are allowed');
        setToastSeverity('error');
        setToastOpen(true);
      } else {
        setInterestsModalOpen(true);
      }
    }}
    sx={{
      color: 'white',
      height: 55,
      borderRadius: 2,
      borderColor: 'white',
      '&:hover': {
        borderColor: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    }}
  >
    Select Interests
  </Button>
) : (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      border: '1px solid white',
      borderRadius: 2,
      padding: '8px 12px',
      height: 37
    }}
  >
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {interests.map((interest) => (
        <Box
          key={interest}
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 3,
            border: '1px solid #00C1A0',
            backgroundColor: '#00C1A0',
            color: 'black',
            fontWeight: 500,
            fontSize: '0.85rem',
          }}
        >
          {interest}
        </Box>
      ))}
    </Box>
    <IconButton
      onClick={() => setInterestsModalOpen(true)}
      sx={{
        color: 'white',
        ml: 1
      }}
    >
      <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
    </IconButton>
  </Box>
)} 
      <TextField
                  name="githublink"
                  label="Github Link"
                  value={formData.githublink}
                  onChange={handleInputChange}
                  error={!!githubError}
                  helperText={githubError}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#ff4444',
                    }
                  }}
                />

              </Box>
            );
            case 4:
  return (
    <Box
      sx={{
        mt: 5,
        ml: 15,
        mr: 15,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Subtitle just like case 2 */}
      <Typography
        variant="h3"
        sx={{
          color: 'white',
          fontWeight: 600,
          textAlign: 'left',
          mb: 6,
          fontSize: '2.5rem',
          width: '100%',
        }}
      >
        {steps[step].subtitle}
      </Typography>

      {/* Profile box centered */}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Box
          sx={{
            width: 280,
            height: 380,
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
              width: 280,
              height: 380,
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
  );
            
        }
    }

  return (
    <>
    <Modal 
      open={open} 
      onClose={(event, reason) => {

        if (
          (reason === 'backdropClick' || reason === 'escapeKeyDown') &&
          step !== steps.length - 1
        ) {
          return; // prevent closing
        }
        onClose();
      }}
      disableEscapeKeyDown={step !== steps.length - 1}
    >
      <Box
  sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    height: '90vh',
    maxWidth: 1200,
    maxHeight: 800,
    bgcolor: '#00645C',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto', // Allow scrolling, but no visible scrollbar
  }}
>
  <Typography variant="h2" fontWeight="bold" color='white' fontSize={65} mt={5}>
    {steps[step].title}
  </Typography>

  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexGrow: 1, // Allow the content to take up the available space
    }}
  >
    {/* Step Content */}
    <Box sx={{ flexGrow: 1 }}>
      {renderStepContent()}
    </Box>

    {/* Button container */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        mt: 2, // margin-top to adjust space between content and buttons
        padding: '10px 0',  // You can adjust padding here for proper spacing
      }}
    >
      {step > 0 ? (
        <Button
          onClick={handleBack}
          variant="outlined"
          sx={{
            backgroundColor: '#0C4278',
            color: 'white',
            width: { xs: '100%', sm: 130 },
            height: 50,
          }}
        >
          Back
        </Button>
      ) : (
        <Box sx={{ width: 150 }} />
      )}

      {step < steps.length - 1 ? (
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={step === 3 && formData.githublink && !validateGithubLink(formData.githublink)}
          sx={{
            backgroundColor: '#0C4278',
            color: 'white',
            width: { xs: '100%', sm: 130 },
            height: 50,
            '&:disabled': {
              backgroundColor: 'grey.400',
              color: 'white',
            },
          }}
        >
          Next
        </Button>
      ) : (
        <Button
          onClick={handleFinish}
          variant="contained"
          sx={{
            backgroundColor: '#0C4278',
            color: 'white',
            width: { xs: '100%', sm: 130 },
            height: 50,
          }}
        >
          Finish
        </Button>
      )}
    </Box>
  </Box>
  <style>
    {`
      /* Hide scrollbar on webkit browsers (Chrome, Safari, Edge) */
      ::-webkit-scrollbar {
        display: none;
      }
    `}
  </style>
</Box>

    </Modal>
    <InterestsModal
      open={interestsModalOpen}
      onClose  ={()  =>  setInterestsModalOpen  (  false  )}
      selectedInterests  ={interests}
      setSelectedInterests  =  {  setInterests  }
    />
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
    </>
  );
}
