import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import 'face-api.js';

const VideoCanvas = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.loadTinyFaceDetectorModel('/model');
    };

    const detectFaces = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const displaySize = { width: video.width, height: video.height };

      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      }, 100);
    };

    const initializeVideo = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
    
      video.addEventListener('loadeddata', () => {
        video.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      });
    
      video.addEventListener('play', () => {
        detectFaces();
      });
      video.src="./video.webm";
    };
      

    loadModels();
    initializeVideo();
  }, []);

  return (
    <div>
      <video ref={videoRef} controls width="640" height="360" src="./video.webm" />
      <canvas ref={canvasRef} width="640" height="360" style={{ position: 'absolute' }} />
    </div>
  );
};

export default VideoCanvas;
