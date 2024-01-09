import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import * as faceapi from 'face-api.js';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedVideoSource, setSelectedVideoSource] = useState('');

  useEffect(() => {
    const initFaceApi = async () => {
      // Load face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri('/model');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/model');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/model');

      console.log('Face-api.js models loaded successfully!');
    };

    initFaceApi();
  }, []);

  const handleVideoChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const video = videoRef.current;
      const canvas = new fabric.Canvas(canvasRef.current);

      // Update selected video source state
      setSelectedVideoSource(URL.createObjectURL(selectedFile));

      // Update video source
      video.src = URL.createObjectURL(selectedFile);
      video.load();

      // Wait for video metadata to be loaded before starting face detection
      video.addEventListener('loadedmetadata', async () => {
        console.log('Video metadata loaded:', video.videoWidth, video.videoHeight);

        // Set canvas dimensions to match the video dimensions
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        canvas.setDimensions({ width: videoWidth, height: videoHeight });

        // Play the video after updating the source
        video.play();

        console.log('Starting face detection...');

        // Start face detection on the video
        const displaySize = { width: videoWidth, height: videoHeight };
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512 })).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        console.log('Face detection complete:', resizedDetections);

        // Draw rectangles around detected faces on the canvas
        resizedDetections.forEach((detection) => {
          const { box } = detection;
          const rect = new fabric.Rect({
            left: box.x,
            top: box.y,
            width: box.width,
            height: box.height,
            fill: 'transparent',
            stroke: 'red',
            strokeWidth: 2,
          });
          canvas.add(rect);
        });
      });
    }
  };

  return (
    <div>
      {/* Input to allow users to select a video file */}

      {/* Video element */}
      <video
        controls
        loop
        muted
        ref={videoRef}
        style={selectedVideoSource.length === 0 ? { display: 'none'} : {}}
        onLoadedMetadata={() => {
          videoRef.current.play();
        }}
      >
        {/* Dynamic video source based on selectedVideoSource */}
        <source src={selectedVideoSource}/>
      </video>
       <br></br>
      {/* Canvas for drawing rectangles */}
      <canvas ref={canvasRef} style={{ position: 'absolute', border: '1px solid black'}} />
      <input style={{marginTop:"3%",marginLeft:"48%"}} type="file" accept="video/*" onChange={handleVideoChange} />
    </div>
  );
};

export default VideoPlayer;