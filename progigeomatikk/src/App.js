import logo from './logo.svg';
import './App.css';
import Map, {Marker} from "react-map-gl";
import { useState } from 'react';
import Trondheim from './components/Trondheim';
import FileUpload from './components/FileUpload';


function App() {

  return (
    <div className="App">
      <h1>GIS-app</h1>
      <FileUpload/>
      <Trondheim/>
      </div>
  );
}

export default App;
