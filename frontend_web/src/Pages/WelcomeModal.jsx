import React, { useState, useRef } from 'react';
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
    Menu
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
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
      title: 'Congrats! You’ve completed the first step!',
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
  });
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);

  const fileInputRef = useRef();
  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));
  const handleFinish = () => {
    onClose();
    setStep(0); // Reset if needed
  };

  const handleAvatarChange = (e) => {
    setAvatar(URL.createObjectURL(e.target.files[0]));
  };

  const handleResumeChange = (e) => {
    setResume(e.target.files[0].name);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [anchorEl, setAnchorEl] = useState(null); // anchor for dropdown

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSkillSelect = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    } else {
      setSkills(skills.filter((s) => s !== skill));
    }
  };

  const isOpen = Boolean(anchorEl);


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
      mt: 8,
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
          <Box mt={3}>
            <Button variant="outlined" component="label">
              Upload Resume
              <Input type="file" hidden onChange={handleResumeChange} />
            </Button>
            {resume && (
              <Typography mt={2}>Uploaded: {resume}</Typography>
            )}
          </Box>
        );
        case 4:
            return (
              <Box mt={3} display="flex" flexDirection="column" gap={2} sx={{mt: 9}}>
                <TextField
                  name="fullName"
                  label="Your Name"
                  value={formData.fullName}
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
                <TextField
                  name="role"
                  label="Prefer Role"
                  value={formData.role}
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
          onClick={handleOpen}
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
            onClick={handleOpen}
            sx={{ color: 'white', ml: 1 }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={handleOpen}
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

      {/* Dropdown Menu */}
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

                {interests.length === 0 ? (
  <Button 
    variant="outlined" 
    onClick={() => setInterestsModalOpen(true)}
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
                  name="linkgithub"
                  label="Github Link"
                  value={formData.githublink}
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
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '100%',
        maxHeight: '100%',
        width: 1200,
        height: 800,
        mt: 2,
        bgcolor: '#00645C',
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
        textAlign: 'center',
      }}>

        <Typography variant="h2" fontWeight="bold" color='white' fontSize={65} mt={5}>
          {steps[step].title}
        </Typography>

        {renderStepContent()}

        <Box
            sx={{
            position: 'absolute',
            bottom: 70, // distance from bottom of modal
            left: 15,
            right: 15,
            px: 4,
            display: 'flex',
            justifyContent: 'space-between',
            }}
        >
        {step > 0 ? (
    <Button
      onClick={handleBack}
      variant="outlined"
      sx={{
        backgroundColor: '#0C4278',
        color: 'white',
        width: 130,
        height: 50,
      }}
    >
      Back
    </Button>
  ) : (
    <Box sx={{ width: 150 }} /> // Placeholder to keep spacing
  )}
        {step < steps.length - 1 ? (
        <Button onClick={handleNext} variant="contained" sx={{backgroundColor: '#0C4278', color: 'white', width: 130,height: 50}}>
        Next
        </Button>
        ) : (
        <Button onClick={handleFinish} variant="contained" sx={{backgroundColor: '#0C4278', color: 'white', width: 130,height: 50}}>
        Finish
        </Button>
        )}
        </Box>
    </Box>
    </Modal>
    <InterestsModal
      open={interestsModalOpen}
      onClose  ={()  =>  setInterestsModalOpen  (  false  )}
      selectedInterests  ={interests}
      setSelectedInterests  =  {  setInterests  }
    />
    </>
  );
}
