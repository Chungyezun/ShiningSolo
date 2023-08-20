import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import mergeImages from 'merge-images';
import photoFrame from './image/frame.jpg';
import backgroundImage from './image/bg2.jpg'; 
import shadowImage from './image/shadow.jpg'; 
import html2canvas from 'html2canvas';

function App() {
  const cropperRef = useRef(null);
  const [inputImage, setInputImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [mergedImage, setMergedImage] = useState(null);
  const [frameSize, setFrameSize] = useState({ width: null, height: null });
  const [finalmergedImage, setFinalMergedImage] = useState(null);
  const [finalShadow, setFinalShadow] = useState(null);
  const [scaledImage, setScaledImage] = useState({ width: null, height: null });

  const onCrop = () => {
    const imageElement = cropperRef.current;
    const cropper = imageElement.cropper;
    setCroppedImage(cropper.getCroppedCanvas().toDataURL());
  };

  function changeHandler (){
    const img = new Image();
    img.src = croppedImage;
    img.onload = () => {
      console.log('first image loaded:', img.width, img.height);
      const bgimg = new Image();
      bgimg.src = backgroundImage;
      bgimg.onload = async () => {
        console.log('background image loaded:', bgimg.width, bgimg.height);
        const isImageWidthBigger = img.width >= img.height;
        const scaleRatio = 1 / 2;
        const scaleFactor = isImageWidthBigger ? (bgimg.width * scaleRatio) / img.width : (bgimg.height * scaleRatio) / img.height;
        const scaledImageWidth = Math.floor(img.width * scaleFactor);
        const scaledImageHeight = Math.floor(img.height * scaleFactor);
        console.log('scaled image loaded:', scaledImageWidth, scaledImageHeight);


        
        const newWidth = scaledImageWidth + 20;
        const newHeight = scaledImageHeight + 20;
        console.log('frame loaded:', newWidth, newHeight);
        setFrameSize({ width: newWidth, height: newHeight });
        setScaledImage({ width: scaledImageWidth, height: scaledImageHeight });
      }
      
    };
    

    
  }
  

  useEffect(() => {
    if (frameSize.width && frameSize.height) {
      console.log('frame loaded2:', frameSize.width, frameSize.height);
      const frameImg = new Image();
      frameImg.src = photoFrame;
      frameImg.onload = async () => {

        const resizedMergedImage = new Image();
        resizedMergedImage.src = croppedImage;
        resizedMergedImage.width = scaledImage.width;
        resizedMergedImage.height = scaledImage.height;

        resizedMergedImage.onload = async function (){
          const canvas1 = document.createElement('canvas');
          canvas1.width = scaledImage.width;
          canvas1.height = scaledImage.height;
          const context1 = canvas1.getContext('2d');
          context1.drawImage(resizedMergedImage,0,0,scaledImage.width,scaledImage.height);
          const resizedImage = canvas1.toDataURL('image/jpeg');


          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = frameSize.width;
          canvas.height = frameSize.height;
          const borderWidth = 0.5;
          context.fillStyle = 'gray'; 
          context.fillRect(0, 0, frameSize.width, frameSize.height); 
          context.drawImage(frameImg, borderWidth, borderWidth, frameSize.width - 2 * borderWidth, frameSize.height - 2 * borderWidth);  

          const frameDataUrl = canvas.toDataURL('image/jpeg');
          await mergeImages(
            [
              {
                src: frameDataUrl,
                x: 0,
                y: 0,
              },
              {
                src: resizedImage,
                x: 10,
                y: 10,
              },
            ],
            {
              width: frameSize.width,
              height: frameSize.height,
            }
          )
            .then((b64) => {
        
                setMergedImage(b64);

                  
              })
              .catch((error) => console.log(error));

      }


        



        
      };
    }
      
  }, [frameSize]);


  useEffect(() => {
    if (mergedImage) {
      const bgimg = new Image();
      bgimg.src = backgroundImage;
      bgimg.onload = async () => {
          const mergedImg = new Image();
          mergedImg.src = mergedImage;
          mergedImg.onload = async () => {
            const canvasMerge = document.createElement('canvas');
            const contextMerge = canvasMerge.getContext('2d');
            canvasMerge.width = mergedImg.width;
            canvasMerge.height = mergedImg.height;
            contextMerge.shadowColor = 'rgba(0, 0, 0, 0.5)';
            contextMerge.shadowBlur = 10;
            contextMerge.shadowOffsetX = 5;
            contextMerge.shadowOffsetY = 5;
            contextMerge.fillStyle = 'rgb(210,210,210)'; 
            contextMerge.fillRect(0, 0, mergedImg.width, mergedImg.height); 
            contextMerge.drawImage(mergedImg, 0, 0, mergedImg.width - 5, mergedImg.height - 5);  

            const rImage = canvasMerge.toDataURL('image/jpeg');




            await mergeImages(
              [
                {
                  src: backgroundImage,
                  x: 0,
                  y: 0,
                },
                {
                  src: rImage,
                  x: (bgimg.width - frameSize.width) / 2,
                  y: (bgimg.height - frameSize.height) / 2,
                },
              ],
              {
                width: bgimg.width,
                height: bgimg.height,
              }
            )
            .then((b64)=>{
              setFinalMergedImage(b64);
            })
            }

        

        


        
      };
            
        
    }
  }, [mergedImage]);


  useEffect(() => {
    if (finalmergedImage) {


      

      // const shadowImg = new Image();
      // shadowImg.src = shadowImage;
      // shadowImg.style.opacity = '0.3';
      // shadowImg.onload = () => {
      //   const canvasShadow = document.createElement('canvas');
      //   canvasShadow.width = shadowImg.naturalWidth;
      //   canvasShadow.height = shadowImg.naturalHeight;
      //   const contextShadow = canvasShadow.getContext('2d');
      //   contextShadow.drawImage(shadowImg,0,0,shadowImg.naturalWidth,shadowImg.naturalHeight);
      //   const shadow = canvasShadow.toDataURL('image/jpeg');

        const bgimg = new Image();
        bgimg.src = backgroundImage;
        bgimg.onload = async () => {
        
          mergeImages(
            [
              {
                src: finalmergedImage,
                x: 0,
                y: 0,
              },
              {
                src: shadowImage,
                x: 0,
                y: 0,
              },
            ],
            {
              width: bgimg.width,
              height: bgimg.height,
            }
          )
          .then((b64)=>{
            setFinalShadow(b64);
          })
        };


      // }
      
      
      
      
    }
      
  }, [finalmergedImage]);

  
  const screenShot = () => {
    html2canvas(document.querySelector("#captureDiv")).then(canvas => {
      document.body.appendChild(canvas)
    });
  };



  // const captureDiv = document.getElementById('captureDiv');
  // makeDivToImageFile(captureDiv);

  // function saveAs(url, fileName) {
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = fileName;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }  
  
  // function makeDivToImageFile(captureDiv) {
  //   html2canvas(captureDiv, {
  //     allowTaint: true,
  //     useCORS: true,
  //     width: captureDiv.offsetWidth,
  //     height: captureDiv.offsetHeight,
  //     scale: 1
  //   }).then(function (canvas) {
  //     const imageURL = canvas.toDataURL('image/jpeg');
  //     saveAs(imageURL, 'new file.jpg');
  //   }).catch(function (err) {
  //     console.log(err);
  //   });
  // }
  


  const handleImageChange = (e) => {
    setInputImage(URL.createObjectURL(e.target.files[0]));
    setFinalMergedImage(null);
  };

  return (
    <div>
      <div id = "captureDiv" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            // boxShadow: '10px 5px 5px red',
            // Add other styles as desired
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
        <Cropper
          src={inputImage}
          crop={onCrop}
          ref={cropperRef}
          style={{
            border: '2px solid black',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
      <button 
        onClick={changeHandler}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          // Add other styles as desired
        }}
      >Change!</button>
      </div>
      {/* <button onClick = {screenShot}>ScreenShot</button> */}
      {finalShadow && (
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)',
            backgroundColor: 'lightgray',

          }}
        >
          <img className="abc" src={finalShadow} alt="Work Picture" />
        </div>
      )}
    </div>
  );
}

export default App;


