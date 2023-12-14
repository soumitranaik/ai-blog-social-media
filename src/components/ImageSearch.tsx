import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { createClient } from "pexels";
import axios from "axios";
import { auth, storage } from "../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import html2canvas from "html2canvas";
import aqua from "../images/aqua.png";
import { sendIdeatoOpenAI } from "../config/openai";
import { ColorResult, SketchPicker  } from 'react-color';
import {
  Typography,
  Button,
  Stack,
  ButtonGroup,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress,
  LinearProgress, Box, Switch, ToggleButton, ToggleButtonGroup, Container
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import SaveIcon from '@mui/icons-material/Save';
import FeedIcon from '@mui/icons-material/Feed';
import { LoadingButton } from "@mui/lab";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { addDoc, collection} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Slider from "@mui/material/Slider";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


interface Photo {
  url: string;
  src: {
    large: string;
  };
}

interface imgquery {
  query: string;
}
const client = createClient(
  "BXEZbo4Ygnkd81WvIlEBwlVaLD8fypaXYP94Pl2ff7iIwYEOvV4gUUkJ"
);

const ImageSearch = (props: imgquery) => {
  /*const [query, setQuery] = useState <string> ("");*/

  const divRef = useRef(null);
  const { query } = props;
  const [photo, setPhoto] = useState<Photo[] | null>(null);
  const [template, setTemplate] = useState(1);
  const [content, setContent] = useState("");
  const [DownloadUrl, setDownloadUrl] = useState("");
  const [loadingPhoto, setLoadingphoto] = useState(true);
  const [openDialog, setOpendialog] = useState(false);
  const [showInstabtn, setShowinstabtn] = useState(false);
  const [loadingSavepng, setLoadingSavepng] = useState(false);
  const [loadingSaveDB, setloadingSaveDB] = useState(false);
  /*const [buttonText, setButtontext] = useState("Finalize Template");*/
  const [showFinalizebutton, setshowFinalizebutton] = useState(true);
  const [t1boxColor, setT1boxcolor] = useState("#fff");
  const [t2GradientColor, setT2Gradientcolor] = useState("#fff");
  const [isDarkGradient, setIsDarkGradient] = useState(false);
  const [templateimg, setTemplateimg] = useState("");
  const [user] = useAuthState(auth);
  const [showpreviewbtn, setShowpreviewbtn] = useState(false);
  const [pageurl, setPageUrl] = useState("");
  const [templatesbutton, setTemplatesbutton] = useState <string | null>(null);
  const [imgwidth, setImgwidth] = useState(200);
  const [bannerimgUrl, setBannerimgUrl] = useState("")

  const postsRef = collection(db, "pagecontent");
  /*const handleSearch = () => {
     client.photos.search({ query, per_page: 1 }).then((response: any) => {
    setPhoto(response.photos);
  });
}*/

  /*useEffect(() => {
    handleSearch();
  }, [query]);*/
  const posttoinstagram = () => {
    if (photo) {
      const datatosend = {
        title: query,
        url: DownloadUrl,
      };

      try {
        const response = axios.post(
          "https://hook.eu2.make.com/cqborpp7ja8g4su7s4ny6b7gqwreybkl",
          datatosend
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const finalize = () => {
    if (photo) {
      const pexelsURL = photo[0].src.large;
      fetch(pexelsURL)
        .then((response) => response.blob())
        .then((blob) => {
          const imageRef = ref(storage, `banner_images/${v4()}`);
          return uploadBytes(imageRef, blob);
        })
        .then((snapshot) => {
          // Snapshot contains metadata about the uploaded file
          return getDownloadURL(snapshot.ref);
          
        })
        .then((downloadURL) => {
          console.log("Download banner URL:", downloadURL);
          setBannerimgUrl(downloadURL);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  const savePng = () => {
    const divElement = divRef.current;
    setLoadingSavepng(true);
    finalize();
    if (divElement) {
      html2canvas(divElement, { useCORS: true, allowTaint: true })
        .then((canvas) => {
          const templateUrl = canvas.toDataURL("image/png");
          console.log("Generated PNG URL:", templateUrl);
          setTemplateimg(templateUrl);
          return fetch(templateUrl)
            .then((respone) => respone.blob())
            .then((blob) => {
              const imageRef = ref(storage, `images/${v4()}`);
              return uploadBytes(imageRef, blob);
            })
            .then((snapshot) => {
              return getDownloadURL(snapshot.ref);
            })
            .then((downloadURL) => {
              console.log("Download URL: ", downloadURL);
              setDownloadUrl(downloadURL);
              setShowinstabtn(true);
              setshowFinalizebutton(false);
            });
        })
        .catch((error) => {
          console.error("Error converting to PNG or uploading:", error);
        })
        .finally(() => {
          setLoadingSavepng(false);
          /*setButtontext(`Template ${template} selected`);*/
          setShowpreviewbtn(true);
        })
    }
  };
  const generatePostText = async () => {
    const contentres = await sendIdeatoOpenAI(query);
    setContent(contentres);
    console.log('generatePostText has run.');
  };

  const handleColor = (color : ColorResult) => {
    if (template === 1) {
      setT1boxcolor(color.hex);
    } else if (template === 2) {
      setT2Gradientcolor(color.hex);
    }
  };

  const toggleGradient = () => {
    console.log('Before Toggle:', isDarkGradient);
  setIsDarkGradient((prevIsDarkGradient) => {
    console.log('Previous State:', prevIsDarkGradient);
    return !prevIsDarkGradient;
  });
  }

  const saveDatatoDB = async () => {
    setloadingSaveDB(true);
    try {
      const url = convertToUrl(query);
      setPageUrl(url);
      await addDoc(postsRef, {
        content: content,
        image: DownloadUrl,
        url: url,
        userId: user?.uid,
        h1: query,
        bannerImg: bannerimgUrl
      });
    } catch (error) {

      console.error("Error in saveDatatoDB:", error);
    } finally{
      setloadingSaveDB(false);
      setShowinstabtn(false);
    }
  };

  const convertToUrl = (longtext : string) => {
   const urlFormat = longtext.toLowerCase().replace(/\s+/g, '-');
   const sanitizedUrl = urlFormat.replace(/[^a-z0-9-]/g, '');
   return sanitizedUrl;
  }

  const handleTemplateChange = (_event: React.MouseEvent<HTMLElement>, updatedTemplate: string) => {
    setTemplatesbutton(updatedTemplate);
  }

  const handleSliderChange = (event: Event, newValue : number | number[]) => {
    setImgwidth(newValue as number);
    }

  useEffect(() => {
    if (query) {
      client.photos
        .search({ query, per_page: 1 })
        .then((response: any) => {
          setPhoto(response.photos);
          setLoadingphoto(false);
          console.log(response);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
      generatePostText();
      
    }
  }, [query]);

  if(loadingPhoto) {
    return(
      <Stack spacing={2} sx={{ alignItems:'center', margin:'100px'}}>
        <LinearProgress color="warning" sx={{width:'100%'}}/>
      </Stack>
    )
  }

  return (
    <Stack spacing={2} sx={{ alignItems: "center", margin: "40px 0" }}>
      {photo && template === 1 && (
        <div className="container">
          <Box
            ref={divRef}
            width={{
              xs: 300,
              sm: 450,
            }}
            height={{
              xs: 300,
              sm: 450,
            }}
          >
            <div
              className="image-wrapper"
              style={{
                background: `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${photo[0].src.large})`,
              }}
            >
              <div className="text-box">
                <Typography
                  variant="h5"
                  className="image-text"
                  sx={{ backgroundColor: t1boxColor }}
                  fontSize={{ xs: 15, sm: 24 }}
                >
                  {query}
                </Typography>
              </div>
            </div>
          </Box>
          {/*<Stack sx={{ alignItems: "center" }}>
            <LoadingButton
              variant="contained"
              loading={loadingSavepng}
              color="secondary"
              className="savepng"
              startIcon={
                loadingSavepng && <CircularProgress size={20} color="inherit" />
              }
              onClick={savePng}
            >
              {buttonText}
            </LoadingButton>
          </Stack>*/}
        </div>
      )}
      {photo && template === 2 && (
        <div className="container">
          <Box
            ref={divRef}
            width={{
              xs: 300,
              sm: 450,
            }}
            height={{
              xs: 300,
              sm: 450,
            }}
          >
            <Box
              className="image-wrapper2"
              sx={{
                background: isDarkGradient
                  ? `linear-gradient(0deg, rgb(0 0 0 / 83%) 29%, rgb(0 0 0 / 74%) 50%, rgb(0 0 0 / 39%) 95%), url(${photo[0].src.large})`
                  : `linear-gradient(0deg, rgb(255 255 255 / 83%) 29%, rgb(201 193 193 / 74%) 50%, rgb(0 0 0 / 39%) 95%), url(${photo[0].src.large})`,
                border: "20px inset rgb(113 0 112 / 65%)",
                width: {
                  xs: 257,
                  sm: 415,
                },
                height: {
                  xs: 257,
                  sm: 415,
                },
              }}
            >
              <div className="text-box2">
                <Typography
                  variant="h5"
                  className="image-text2"
                  sx={{
                    color: isDarkGradient ? "#ffffff" : "#000000",
                  }}
                  fontSize={{ xs: 18, sm: 24 }}
                >
                  {query}
                </Typography>
              </div>
            </Box>
          </Box>
        </div>
      )}

      {photo && template === 3 && (
        <Box>
          <Box ref={divRef} 
           width={{
            xs: 300,
            sm: 450,
          }}
          height={{
            xs: 300,
            sm: 450,
          }}>
            <div className="image-wrapper3">
              <div className="text-box3">
                <Typography
                  variant="h4"
                  className="image-text3"
                  sx={{
                    textAlign: "right",
                    color: "#fff",
                  }}
                  fontSize={{ xs: 22, sm: 28 }}
                >
                  {query}
                </Typography>
              </div>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "flex-end", height: "100%"  }}
              >
                <img
                  src={photo[0].src.large}
                  style={{
                    width: `${imgwidth}px`,
                    height: "auto",
                    margin: "35px 10px",
                    border: "5px solid #ffffff"
                  }}
                />
              </Stack>
            </div>
          </Box>
        </Box>
      )}

      {/*photo && <button onClick={finalize}>Finalize image and content(saves raw image to /)</button>*/}
      <Container maxWidth="md">
        <Typography variant="h6"  fontSize={{ xs: 18, sm: 28 }} textAlign="center">
          {content} 
        </Typography>
      </Container>
      <Stack spacing={2} sx={{ alignItems: "center" }}>
        <Typography variant="subtitle2" color="secondary">
          Choose a template
        </Typography>
        <Stack spacing={2} direction="row">
          {/*<ButtonGroup variant="contained" color="warning">
            {photo && (
              <Button onClick={() => setTemplate(1)}>Template 1</Button>
            )}

            {photo && (
              <Button onClick={() => setTemplate(2)}>Template 2</Button>
            )}

            {photo && (
              <Button onClick={() => setTemplate(3)}>Template 3</Button>
            )}
            </ButtonGroup>*/}

          <ToggleButtonGroup
            color="warning"
            value={templatesbutton}
            onChange={handleTemplateChange}
            exclusive
          >
            <ToggleButton value="template1" onClick={() => setTemplate(1)}>
              {" "}
              Template 1{" "}
            </ToggleButton>
            <ToggleButton value="template2" onClick={() => setTemplate(2)}>
              {" "}
              Template 2{" "}
            </ToggleButton>
            <ToggleButton value="template3" onClick={() => setTemplate(3)}>
              {" "}
              Template 3{" "}
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          {template === 1 && (
            <SketchPicker color={t1boxColor} onChangeComplete={handleColor} />
          )}
          {template === 2 && (
            <>
              <Switch
                color="warning"
                checked={isDarkGradient}
                onChange={toggleGradient}
              />
              <Typography color="secondary">
                {isDarkGradient ? "Dark Background" : "Light Background"}
              </Typography>
            </>
          )}
          {template === 3 && (
            <>
              <Stack direction="column">
                <Typography>Adjust image size</Typography>
                <Slider
                  color="warning"
                  value={imgwidth}
                  onChange={handleSliderChange}
                  min={100}
                  max={400}
                  step={1} 
                  defaultValue={150}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
      <Stack sx={{ alignItems: "center" }}>
        {showFinalizebutton && (
          <LoadingButton
            variant="contained"
            loading={loadingSavepng}
            color="secondary"
            className="savepng"
            startIcon={
              loadingSavepng && <CircularProgress size={20} color="inherit" />
            }
            onClick={savePng}
          >
            Finalize Template
          </LoadingButton>
        )}
      </Stack>
      {showpreviewbtn && (
        <Stack>
          <Button
            variant="contained"
            startIcon={<RemoveRedEyeIcon />}
            color="warning"
            onClick={() => setOpendialog(true)}
          >
            Preview 
          </Button>
          <Dialog
            open={openDialog}
            onClose={() => setOpendialog(false)}
            
          >
            <DialogTitle>Preview</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Stack spacing={2} sx={{ alignItems: "center" }}>
                  <Typography variant="h5">{query}</Typography>
                  {DownloadUrl && (
                    <img src={templateimg} style={{ width: "85%" }} />
                  )}
                  <Typography>{content}</Typography>
                  <Typography>
                    Blog Page Url:{" "}
                    <a href={`http://localhost:3000/blogs/${pageurl}`}>
                      http://localhost:3000/blogs/{pageurl}
                    </a>
                  </Typography>
                </Stack>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Stack
                spacing={2}
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: "30px",
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setOpendialog(false);
                    setshowFinalizebutton(true);
                    setShowpreviewbtn(false);
                  }}
                >
                  Cancel
                </Button>
                {showInstabtn ? (
                  <LoadingButton
                    variant="contained"
                    loading={loadingSaveDB}
                    color="secondary"
                    startIcon={
                      <>
                        {loadingSavepng ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <FeedIcon /> // Static icon when not loading
                        )}
                      </>
                    }
                    onClick={saveDatatoDB}
                  >
                    Generate Blog
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<InstagramIcon />}
                    onClick={posttoinstagram}
                  >
                    Post to Instagram
                  </Button>
                )}
              </Stack>
            </DialogActions>
          </Dialog>
        </Stack>
      )}
    </Stack>
  );
};

export default ImageSearch;
