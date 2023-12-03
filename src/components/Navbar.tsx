import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Stack, Button } from '@mui/material';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { Login } from '../pages/login';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [user] = useAuthState(auth);

    const signUserOut = async() => {
        await signOut(auth)
     };
  return (
    <AppBar position="static" color="inherit" sx={{ padding: 0 }}>
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit">
          <AppShortcutIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Social Media Automation
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button component='a' href='/' color="inherit" >Home</Button>
          {user ? (
            <div>
              <Button color="inherit" onClick={signUserOut}>
                Logout
              </Button>
            </div>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar