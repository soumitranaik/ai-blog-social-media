import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useParams } from 'react-router-dom';
import { Box, Stack, Paper, Container, Typography } from '@mui/material';

export const Blog = () => {
  const { blogurl } = useParams();
  const [blogcontent, setBlogcontent] = useState(null);
  const [blogH1, setblogH1] = useState(null);
  const [banner, setBanner] = useState(null);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsRef = collection(db, 'pagecontent');
        const blogsQuery = query(blogsRef, where("url",  "==", blogurl));
        const querySnapshot = await getDocs(blogsQuery);
      
        if (!querySnapshot.empty) {
          const blogData = querySnapshot.docs[0].data();
          setBlogcontent(blogData.content);
          setblogH1(blogData.h1);
          setBanner(blogData.bannerImg);
        }
        else {
          console.log ('Blog not found')
        }
      }
      catch(error) {
        console.error('error fetching: ', error)
      }
    };
    fetchData();
  }
  , [blogurl]);
  console.log("blogurl:" , blogurl);

  return (
    <>
      {blogcontent !== null ? (
        <div>
          <Paper
            elevation={2}
            style={{
              backgroundImage: `url("${banner}")`,
              backgroundSize: "cover",
              minHeight: "300px",
              backgroundPosition: "center",
            }}
          >
            
          </Paper>
          <Container>
            <Box mt={4} sx={{ paddingBottom:'120px' }}>
              <Typography
                variant="h2"
                color="#2C5F2D"
                style={{ paddingTop: "50px", paddingBottom: "50px" }}
              >
                {blogH1}
              </Typography>
              <Typography
                color="#545454"
                variant="body1"
                style={{ fontWeight: "200" }}
              >
                {blogcontent}

                <p>
                  *Remaining AI generated content to come below*</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aliquam porttitor rhoncus nulla, in ornare metus vehicula ac.
                  Integer hendrerit lorem in est elementum vulputate. Proin et
                  odio leo. Sed et vehicula mi. Proin ac nisl mi. Phasellus eget
                  tincidunt est, tempus semper quam. Praesent dapibus fringilla
                  risus vitae pretium. Etiam ut felis sit amet neque elementum
                  eleifend nec sed urna. Donec fringilla lacus eu tortor
                  fermentum, vitae placerat nunc sodales. Aliquam urna augue,
                  luctus id ipsum et, maximus tincidunt mi. Nam nec lacus odio.
                  Proin lobortis urna interdum mauris egestas, in accumsan
                  libero mollis. Sed aliquam porttitor facilisis. Fusce
                  tincidunt vehicula nulla id fermentum. Vestibulum et facilisis
                  metus. Sed ac mauris scelerisque nisi dictum tincidunt in vel
                  velit. Pellentesque fermentum nunc blandit rutrum imperdiet.
                  Aenean dignissim odio id augue hendrerit rhoncus et ac diam.
                  Nam nisi eros, malesuada non sem ullamcorper, posuere rhoncus
                  lorem. Proin efficitur consectetur mi pharetra placerat. Proin
                  mi ex, luctus nec ultricies ac, lacinia ac sem. Mauris
                  ullamcorper tortor ut sapien porttitor, nec semper velit
                  ullamcorper. Maecenas id vehicula ipsum. Vivamus ultrices
                  bibendum diam nec mollis. Sed in erat in ligula faucibus
                  gravida eu et velit. Nulla facilisi. Donec sit amet nisl in
                  felis porta pharetra quis ut est. Etiam convallis tortor nec
                  libero efficitur ornare. Vestibulum consequat dignissim
                  feugiat. Nunc suscipit semper blandit.
                </p>
              </Typography>

              {/* More Blog Posts */}
              {/* Repeat the above pattern for additional blog posts */}
            </Box>
          </Container>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
      }
      export default Blog;