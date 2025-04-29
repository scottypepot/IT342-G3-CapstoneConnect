import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Paper,
  TextField,
  IconButton,
  Badge,
  Divider,
  Menu,
  MenuItem,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import GitHubIcon from '@mui/icons-material/GitHub';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import Navbar from './NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config/api';

// Define ProfilePreview as a separate component
const ProfilePreview = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: data.fullName,
            course: data.role,
            bio: data.about,
            skills: data.skills || [],
            interests: data.interests || [],
            profilePicture: data.profilePicture,
            education: data.education,
            work: data.work,
            githubLink: data.githubLink
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (!profile) return null;

  return (
    <Card sx={{ 
      mt: 2, 
      mb: 2,
      backgroundColor: '#f8f9fa',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '400px'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={profile.profilePicture} 
            alt={profile.name}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {profile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.course}
            </Typography>
          </Box>
        </Box>

        {profile.bio && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {profile.bio}
          </Typography>
        )}

        {profile.skills?.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Skills
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {profile.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{
                    backgroundColor: '#FFD700',
                    color: 'rgba(0, 0, 0, 0.87)',
                    mb: 1
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {profile.interests?.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Interests
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {profile.interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  size="small"
                  sx={{
                    backgroundColor: '#90EE90',
                    color: 'rgba(0, 0, 0, 0.87)',
                    mb: 1
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {profile.githubLink && (
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            alignItems: 'center',
            '& a': {
              display: 'flex',
              alignItems: 'center',
              color: '#2d333b',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: '#000000',
                textDecoration: 'underline'
              }
            }
          }}>
            <Link href={profile.githubLink} target="_blank" rel="noopener noreferrer">
              <GitHubIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                GitHub Profile
              </Typography>
            </Link>
          </Box>
        )}

        {(profile.education || profile.work) && (
          <Box sx={{ mt: 2 }}>
            {profile.education && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {profile.education}
                </Typography>
              </Box>
            )}
            {profile.work && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {profile.work}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default function MessagesPage() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuMatch, setMenuMatch] = useState(null);
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();
  const { matchId } = useParams();

  // Add new state for tracking which messages are collaboration requests
  const [collaborationRequests, setCollaborationRequests] = useState(new Set());
  const [attachmentMenuAnchorEl, setAttachmentMenuAnchorEl] = useState(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.matchId);
      const interval = setInterval(() => fetchMessages(selectedMatch.matchId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedMatch]);

  useEffect(() => {
    if (messages.length > 0) {
      const requests = new Set();
      messages.forEach(message => {
        if (message.content.includes("Would love to connect and collaborate")) {
          requests.add(message.id);
        }
      });
      setCollaborationRequests(requests);
    }
  }, [messages]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/matches`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Transform the data to ensure proper structure
        const transformedData = data.map(match => ({
          ...match,
          matchId: match.matchId,
          name: match.name || 'Unknown User',
          profilePicture: match.profilePicture && !match.profilePicture.startsWith('http') 
            ? `${API_URL}${match.profilePicture}` 
            : match.profilePicture || '/uploads/default-avatar.png'
        }));
        setMatches(transformedData);
        
        // If there's a matchId in the URL, select that match
        if (matchId) {
          const matchToSelect = transformedData.find(m => m.matchId === parseInt(matchId));
          if (matchToSelect) {
            setSelectedMatch(matchToSelect);
          }
        }
      } else if (response.status === 401 || response.status === 403) {
        window.location.href = `${API_URL}/oauth2/authorization/microsoft`;
      } else {
        console.error('Error fetching matches:', response.status);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.log('Authentication required. Redirecting to login...');
        window.location.href = `${API_URL}/oauth2/authorization/microsoft`;
      }
    }
  };

  const fetchMessages = async (matchId) => {
    if (!matchId) return; // Don't fetch if no matchId

    try {
      const response = await fetch(`${API_URL}/api/matches/${matchId}/messages?userId=${userId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else if (response.status === 401 || response.status === 403) {
        window.location.href = `${API_URL}/oauth2/authorization/microsoft`;
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/matches/${selectedMatch.matchId}/attachments`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Send message with file info and attachment ID
      const fileMessage = {
        content: JSON.stringify({
          type: 'file',
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          fileSize: data.fileSize,
          contentType: data.contentType
        }),
        senderId: userId,
        attachmentId: data.attachmentId
      };

      // Send the message with the attachment
      const messageResponse = await fetch(`${API_URL}/api/matches/${selectedMatch.matchId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(fileMessage)
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send message with attachment');
      }

      // Refresh messages
      await fetchMessages(selectedMatch.matchId);
      
      // Clear the file input
      event.target.value = '';
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  // Function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  // Add function to handle image preview
  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  // Function to render message content
  const renderMessageContent = (message) => {
    try {
      // Check if the message has attachments
      if (message.attachments && message.attachments.length > 0) {
        const attachment = message.attachments[0];
        const isImage = attachment.contentType.startsWith('image/');

        if (isImage) {
          const fullImageUrl = `${API_URL}${attachment.fileUrl}?view=true`;
          return (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachFileIcon fontSize="small" />
                <Typography component="span">{attachment.fileName}</Typography>
                <Typography component="span" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  ({formatFileSize(attachment.fileSize)})
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  position: 'relative',
                  maxWidth: '300px',
                  cursor: 'pointer',
                  '&:hover .zoom-overlay': {
                    opacity: 1,
                  },
                  '& img': {
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    display: 'block'
                  }
                }}
                onClick={() => handleImageClick(fullImageUrl)}
              >
                <img 
                  src={fullImageUrl}
                  alt={attachment.fileName}
                  loading="lazy"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    e.target.src = '/uploads/default-avatar.png';
                  }}
                />
                <Box
                  className="zoom-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.5)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    borderRadius: '8px',
                  }}
                >
                  <ZoomInIcon sx={{ color: 'white', fontSize: '2rem' }} />
                </Box>
                <Button
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                  size="small"
                  sx={{ 
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent image preview from opening
                    window.open(fullImageUrl, '_blank');
                  }}
                >
                  Download
                </Button>
              </Box>
            </Box>
          );
        } else {
          return (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachFileIcon fontSize="small" />
                <Typography component="span">{attachment.fileName}</Typography>
                <Typography component="span" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  ({formatFileSize(attachment.fileSize)})
                </Typography>
              </Box>
              <Button
                startIcon={<FileDownloadIcon />}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => window.open(`${API_URL}${attachment.fileUrl}`, '_blank')}
              >
                Download
              </Button>
            </Box>
          );
        }
      }

      // If no attachments, render as regular message
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = message.content.split(urlRegex);
      
      return (
        <Typography>
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              return (
                <Link 
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: message.senderId === Number(userId) ? '#fff' : '#0084ff',
                    textDecoration: 'underline',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  {part}
                </Link>
              );
            }
            return part;
          })}
        </Typography>
      );
    } catch (error) {
      console.error('Error rendering message:', error);
      return <Typography>{message.content}</Typography>;
    }
  };

  const handleAcceptMatch = async (matchId) => {
    try {
      const response = await fetch(`${API_URL}/api/matches/${matchId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'ACCEPTED',
          userId: userId // Include the userId to identify who accepted
        })
      });

      if (response.ok) {
        await fetchMessages(matchId); // Refresh messages to show the acceptance message
        await fetchMatches();
      } else if (response.status === 401 || response.status === 403) {
        window.location.href = `${API_URL}/oauth2/authorization/microsoft`;
      }
    } catch (error) {
      console.error('Error accepting match:', error);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        window.location.href = `${API_URL}/oauth2/authorization/microsoft`;
      }
    }
  };

  const handleRejectMatch = async (matchId) => {
    try {
      // Update the match status to REJECTED
      const statusResponse = await fetch(`${API_URL}/api/matches/${matchId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'REJECTED',
          userId: userId // Include the userId to identify who rejected
        })
      });

      if (statusResponse.ok) {
        // After successful rejection
        await fetchMessages(matchId); // Refresh messages to show the rejection message
        await fetchMatches(); // Refresh the matches list
        
        // If this was the currently selected match, clear it and navigate away
        if (selectedMatch?.matchId === matchId) {
          setSelectedMatch(null);
          navigate('/messages');
        }
      } else {
        console.error('Failed to update match status:', await statusResponse.text());
      }
    } catch (error) {
      console.error('Error in handleRejectMatch:', error);
    }
  };

  const handleMenuClick = (event, match) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuMatch(match);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuMatch(null);
  };

  const handleDeleteConversation = async () => {
    if (menuMatch) {
      try {
        const response = await fetch(`${API_URL}/api/matches/${menuMatch.matchId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          setMatches(matches.filter(m => m.matchId !== menuMatch.matchId));
          if (selectedMatch?.matchId === menuMatch.matchId) {
            setSelectedMatch(null);
            navigate('/messages');
          }
          handleMenuClose();
        } else {
          console.error('Error deleting conversation:', response.status);
        }
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    navigate(`/messages/${match.matchId}`);
  };

  const handleSendMessage = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const content = newMessage.trim();
    if (!content) return;

    try {
      const response = await fetch(`${API_URL}/api/matches/${selectedMatch.matchId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          senderId: userId,
          content: content
        })
      });

      if (response.ok) {
        setNewMessage('');
        await fetchMessages(selectedMatch.matchId);
      } else {
        console.error('Failed to send message:', await response.text());
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      backgroundColor: '#EEECEC',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        gap: 2,
        p: 2,
        mt: '80px', // Increased margin-top
        overflow: 'hidden'
      }}>
        {/* Matches List */}
        <Paper sx={{ 
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%'
        }}>
          <Box sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center' // Center the Messages text
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 500,
              color: 'text.primary'
            }}>
              Messages
            </Typography>
          </Box>
          <List sx={{ 
            overflow: 'auto',
            flex: 1,
            py: 0
          }}>
            {matches.map((match) => (
              <ListItem
                key={match.matchId}
                onClick={() => handleMatchSelect(match)}
                sx={{
                  py: 1.5,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  backgroundColor: selectedMatch?.matchId === match.matchId ? '#e3f2fd' : 'transparent',
                }}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleMenuClick(e, match)}
                    sx={{ mr: -1 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Badge
                    badgeContent={match.unreadCount}
                    color="primary"
                    invisible={!match.unreadCount}
                  >
                    <Avatar 
                      src={match.profilePicture} 
                      alt={match.name}
                      sx={{ width: 40, height: 40 }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ 
                      fontWeight: 500,
                      color: 'text.primary',
                      fontSize: '0.95rem'
                    }}>
                      {match.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {match.lastMessage?.timestamp ? 
                        format(new Date(match.lastMessage.timestamp), 'MMM d, yyyy') :
                        match.matchDate ? 
                          format(new Date(match.matchDate), 'MMM d, yyyy') :
                          'No messages yet'
                      }
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Messages Area */}
        <Paper sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
          backgroundColor: '#fff'
        }}>
          {selectedMatch ? (
            <>
              {/* Message Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                flexShrink: 0
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Avatar 
                    src={selectedMatch.profilePicture} 
                    alt={selectedMatch.name}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 500,
                    color: 'text.primary'
                  }}>
                    {selectedMatch.name}
                  </Typography>
                </Box>
              </Box>

              {/* Messages List */}
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                p: 2, 
                display: 'flex', 
                flexDirection: 'column-reverse',
                backgroundColor: '#fff'
              }}>
                <List>
                  {messages.map((message) => (
                    <ListItem
                      key={message.id}
                      sx={{
                        flexDirection: 'column',
                        alignItems: message.senderId === Number(userId) ? 'flex-end' : 'flex-start',
                        mb: 1,
                        px: 2,
                      }}
                    >
                      <Box sx={{ 
                        maxWidth: message.senderId === Number(userId) ? '70%' : '100%',
                        position: 'relative'
                      }}>
                        <Box sx={{
                          backgroundColor: message.senderId === Number(userId) ? '#0084ff' : '#e4e6eb',
                          color: message.senderId === Number(userId) ? '#fff' : '#000',
                          p: 1.5,
                          borderRadius: '18px',
                          wordBreak: 'break-word',
                          fontSize: '0.9375rem',
                          lineHeight: '1.3333',
                        }}>
                          {renderMessageContent(message)}
                        </Box>
                        
                        {/* Show profile for collaboration messages regardless of status */}
                        {message.senderId !== Number(userId) && 
                         message.content.includes("Would love to connect and collaborate") && (
                          <>
                            <ProfilePreview userId={message.senderId} />
                            {selectedMatch.status === 'PENDING' && (
                              <Box sx={{ 
                                mt: 2, 
                                display: 'flex', 
                                gap: 1,
                                justifyContent: 'flex-start'
                              }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleAcceptMatch(selectedMatch.matchId)}
                                  sx={{
                                    backgroundColor: '#90EE90',
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    '&:hover': {
                                      backgroundColor: '#7BC67B'
                                    }
                                  }}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleRejectMatch(selectedMatch.matchId)}
                                  sx={{
                                    backgroundColor: '#FFD700',
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    '&:hover': {
                                      backgroundColor: '#E6C200'
                                    }
                                  }}
                                >
                                  Decline
                                </Button>
                              </Box>
                            )}
                          </>
                        )}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            mt: 0.5,
                            color: '#65676b',
                            fontSize: '0.6875rem',
                            display: 'block',
                            textAlign: message.senderId === Number(userId) ? 'right' : 'left'
                          }}
                        >
                          {message.timestamp ? format(new Date(message.timestamp), 'h:mm a') : ''}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Message Input */}
              {selectedMatch.status === 'ACCEPTED' && (
                <Box sx={{ 
                  p: 2, 
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexShrink: 0
                }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ mr: 1 }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Aa"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    sx={{ 
                      mr: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        backgroundColor: '#f0f2f5',
                        '& fieldset': {
                          border: 'none'
                        }
                      }
                    }}
                  />
                  <IconButton 
                    color="primary" 
                    onClick={handleSendMessage}
                    sx={{
                      backgroundColor: '#0084ff',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#0073e6'
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ 
              p: 3, 
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <Typography variant="h6" color="text.secondary">
                Select a conversation to start messaging. Find your Match to collaborate here!
                </Typography>
            </Box>
          )}
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: 180,
              mt: 1
            }
          }}
        >
          <MenuItem 
            onClick={handleDeleteConversation}
            sx={{
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                '& .MuiSvgIcon-root': {
                  color: 'white'
                }
              },
            }}
          >
            <DeleteOutlineIcon sx={{ mr: 1 }} />
            Delete Conversation
          </MenuItem>
        </Menu>

        {/* Attachment Menu */}
        <Menu
          anchorEl={attachmentMenuAnchorEl}
          open={Boolean(attachmentMenuAnchorEl)}
          onClose={() => setAttachmentMenuAnchorEl(null)}
        >
          <MenuItem onClick={() => {
            fileInputRef.current?.click();
            setAttachmentMenuAnchorEl(null);
          }}>
            <AttachFileIcon sx={{ mr: 1 }} />
            Upload File
          </MenuItem>
        </Menu>
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={Boolean(previewImage)}
        onClose={handleClosePreview}
        maxWidth="xl"
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          position: 'relative',
          maxHeight: '90vh',
          maxWidth: '90vw',
          '& img': {
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain'
          }
        }}>
          <IconButton
            onClick={handleClosePreview}
            sx={{
              position: 'absolute',
              right: -16,
              top: -16,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <img 
            src={previewImage} 
            alt="Preview"
            style={{ display: 'block' }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
