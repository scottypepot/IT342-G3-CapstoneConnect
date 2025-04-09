import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import LandingPage from './Pages/LandingPage.jsx';
import HomePage from './Pages/HomePage.jsx';
import MessagesPage from './Pages/MessagesPage.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#EEECEC',
    },
    secondary: {
      main: '#00acc1',
    },
  },
});
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
)
