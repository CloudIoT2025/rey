import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleOAuthLogin = () => {
    console.log('OAuth 로그인 시도 (더미)');
    // window.location.href = 'https://oauth-provider.com/auth?';
  };

  return (
      <AppBar position="static" className="navbar">
        <Toolbar className="toolbar">
          <Typography variant="h6" className="logo">
            {/*Cloud IoT*/}
          </Typography>

          <div className="nav-buttons">
            <Button color="inherit" onClick={() => navigate('/')}>
              Home
            </Button>

             {/*<Button color="inherit">Dashboard</Button> */}

            <Button color="inherit" onClick={handleOAuthLogin}>
              Login
            </Button>
          </div>
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;