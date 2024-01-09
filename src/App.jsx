// src/App.js
import React from 'react';
import VideoPlayer from './Components/VideoPlayer';
import { Navbar } from './Components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <VideoPlayer />
    </div>
  );
}

export default App;
