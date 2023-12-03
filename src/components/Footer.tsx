import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';




const Footer = () => {

  return (
    <footer className='footer'>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">@Insta account</Typography>
            <Typography variant="body2" color="textSecondary">
              All social media posted here
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{textAlign: 'center'}} className='footerlinks'>
            <Typography variant="h6">Links</Typography>
            <ul>
              <li>
                <Link href="#" >
                  How to use
                </Link>
              </li>
              <li>
                <Link href="#" >
                  Blog
                </Link>
              </li>
              {/* Add more links as needed */}
            </ul>
          </Grid>
        </Grid>
        <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '16px' }}>
          © {new Date().getFullYear()} Social Media AI generator. No rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
