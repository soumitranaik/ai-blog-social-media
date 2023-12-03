import React from 'react';
import { auth, provider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Stack} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export const Login = () => {
    
    const navigate = useNavigate();

    const signinWithGoogle = async() => {
       const result = await signInWithPopup(auth, provider);
       navigate('/');
    }
  return (
    <Box p={8}>
      <Stack spacing={2} sx={{alignItems: 'center'}} >
        <Typography variant='h3'>Sign in with google</Typography>
        <Button variant='contained' color='primary' startIcon={<GoogleIcon />} onClick={signinWithGoogle}>Sign In</Button>
      </Stack>
    </Box>
  )
}
