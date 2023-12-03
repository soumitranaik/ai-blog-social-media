import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { storage } from "../config/firebase";
import { ref, uploadBytes } from 'firebase/storage';
import { v4 } from "uuid";
import  dog  from  "../images/dog.jpeg";


export const Templates = () => {
    const [temptext, setTemptext] = useState("");
    const divRef = useRef(null);
    const [imageupload, setImageupload] = useState<File | null> (null);
    /*const [img, setImg] = useState<string | null>(null);

    const url = 'https://images.pexels.com/photos/3299896/pexels-photo-3299896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
            const imgElement = new Image();
            imgElement.crossOrigin = 'anonymous';
            imgElement.src = url;

            imgElement.onload = () => {
                // Once the image is loaded, set its URL to the state variable
                setImg(url);
              };*/

    const savePng = () => {
        const divElement = divRef.current;

        if (divElement) {
            
            html2canvas(divElement, {useCORS: true, allowTaint: true}).then((canvas) => {
                const templateUrl = canvas.toDataURL('image/png');
                console.log('Generated PNG URL:', templateUrl);

                return fetch(templateUrl).then((respone) => respone.blob())
                .then ((blob) => {
                    const imageRef =  ref(storage, `images/${v4()}`);
                    return uploadBytes(imageRef, blob);
                })
                .then(() => {
                    alert("Image uploaded");
                })
            })
            .catch((error) => {
                console.error('Error converting to PNG:', error);
            });
        }
    }

    /*const uploadImage = () => {
        if (imageupload === null) return;
        const imageRef = ref(storage, `images/${(imageupload as File).name + v4()}`);
        uploadBytes(imageRef, imageupload).then(() => {
            alert("Image uploaded")
        }
        )
    }*/

    

   
    return (
        <div className='container'>
            
            <input type="text" value={temptext} onChange={(e) => setTemptext(e.target.value)}/>
            <div ref={divRef} style={{ width: '720px', height: '720px' }}>
                               
                
                <div className="image-wrapper" style={{background:'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://firebasestorage.googleapis.com/v0/b/ai-social-media-e5577.appspot.com/o/images%2Fpexels-line-knipst-18512532.jpg?alt=media&token=2b2126ac-3b8d-42b9-a01d-be55d47524e3)'}}>
                    {/*<img style={{width: '100%'}} src= "https://firebasestorage.googleapis.com/v0/b/ai-social-media-e5577.appspot.com/o/images%2Fpexels-line-knipst-18512532.jpg?alt=media&token=2b2126ac-3b8d-42b9-a01d-be55d47524e3" crossOrigin='anonymous'/>*/}
                    <div className='text-box'>
                        <h1 className='image-text'>{temptext}</h1>
                    </div>
                </div>
            </div>
            <button onClick={savePng}>Save URL</button>
            {/*<div>
                <input 
                type="file" 
                onChange={(e) => {       
                    if (e.target.files && e.target.files.length > 0) {
                        const fileName = e.target.files[0];
                        setImageupload(fileName);      
                    }
                }
                }
                />

                <button onClick={uploadImage}>Upload Image</button>
            </div>*/}
        </div>
    )
}

export default Templates