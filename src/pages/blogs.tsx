import React, {useState, useEffect} from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import Blog from './blog';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { CardActions, Paper, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

interface Blog {
  userId: string;
  image: string;
  url: string;
  h1: string;
  content: string;
  bannerImg: string;
}

const Blogs = () => {
  const [blogsList, setBlogslist] = useState <Blog[] | null>(null)
  const blogsRef = collection(db, "pagecontent");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(blogsRef);
      setBlogslist(data.docs.map((doc) => ({ ...doc.data() })) as Blog[]);
    };

    fetchData();
  }, []);
 
  return (
    <div>
      <Paper
        elevation={2}
        style={{
          backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/ai-social-media-e5577.appspot.com/o/banner_images%2Fpexels-pixabay-267569.jpg?alt=media&token=1f4ce4a2-d19b-4b60-b4cf-d378cbf7dc5d")`,
          backgroundSize: "cover",
          minHeight: "300px",
          backgroundPosition: "center",
        }}
        >
          <Container><Stack direction="row" alignItems='center' height='100%'><Typography variant='h1' color='#fff'>Blogs</Typography></Stack></Container>
        </Paper>
      <Container sx={{paddingTop:"80px", paddingBottom:"80px"}}>
      <Grid container spacing={2}>
        {blogsList &&
          blogsList.map((blog, index) => (
            <>
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={blog.bannerImg}
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {blog.h1}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {blog.content}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Read More</Button>
                  </CardActions>
                </Card>
              </Grid>
            </>
          ))}
      </Grid>
      </Container>
    </div>
  );
};


export default Blogs