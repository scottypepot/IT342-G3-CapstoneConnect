import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LandingPage from './Pages/LandingPage.jsx';
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
      <LandingPage />
    </ThemeProvider>
  </React.StrictMode>
)
