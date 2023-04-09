import logo from './logo.svg';
import './App.css';
import Map, {Marker} from "react-map-gl";
import { useState } from 'react';
import Trondheim from './components/Trondheim';


function App() {

  return (
    <div className="App">
      <h1>GIS-app</h1>
      <Trondheim/>
      </div>
  );
}

export default App;
