import React, { useState, useEffect } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase';
import { sendMessagetoOpenAI } from '../config/openai';
import ImageSearch from '../components/ImageSearch';
import { Typography , Button , Stack, TextField , Box} from "@mui/material"
import { Login } from './login';

export const Main = () => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const [ideaResponse, setIdearesponse] = useState("");
  

  
  const handleSend = async() => {
    const response = await sendMessagetoOpenAI(input);
    setIdearesponse(response);
  };
  
  if (!user) {
    return (
      <Box paddingTop={6}>
        <Login />

      </Box>
    );
  }


 
  return (
    <Box paddingTop={6} sx={{minHeight:'100vh'}}>
      
      <Stack spacing={4} sx={{alignItems:'center'}}>
      {user?.photoURL &&  <img src={user?.photoURL} />}
        <Typography variant='h2'>Welcome {user?.displayName}</Typography>
      
        <Stack spacing={4} direction='row' sx={{alignItems:'center'}}>
          <TextField label='Enter a topic' color='warning' helperText='For example: Web design services' value={input} onChange={(e) => setInput(e.target.value)}/>
          <Button variant='contained' color='warning' onClick={handleSend}>Suggest Idea </Button>
        </Stack>
      </Stack>
        {ideaResponse && <ImageSearch query={ideaResponse}/>}

      
    </Box>
    
  )
}

