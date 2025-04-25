import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

export default function ChatPage() {
  const { userId } = useParams();
  const [matchUser, setMatchUser] = useState(null);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    const matches = JSON.parse(localStorage.getItem('matches')) || [];
    const user = matches.find(u => u.id.toString() === userId);
    setMatchUser(user);

    const messages = JSON.parse(localStorage.getItem(`chat_${userId}`)) || [];
    setChatLog(messages);
  }, [userId]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newLog = [...chatLog, { sender: 'me', text: message }];
    localStorage.setItem(`chat_${userId}`, JSON.stringify(newLog));
    setChatLog(newLog);
    setMessage('');
  };

  return (
    <Box sx={{ p: 3 }}>
      {matchUser && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={matchUser.avatar} alt={matchUser.fullName} sx={{ mr: 2 }} />
          <Typography variant="h6">{matchUser.fullName}</Typography>
        </Box>
      )}

      <Box sx={{ height: '60vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2 }}>
        <List>
          {chatLog.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
              <ListItemText
                primary={msg.text}
                sx={{
                  backgroundColor: msg.sender === 'me' ? '#DCF8C6' : '#F1F0F0',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  maxWidth: '70%',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <Button onClick={handleSend} variant="contained" sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
