import logo from './logo.svg';
import './App.css';
import Map, {Marker} from "react-map-gl";
import { useState } from 'react';
import Trondheim from './components/Trondheim';
import NavigationMenu from './components/NavigationMenu'


function App() {

  return (
    <div className="App">
      <h1>GIS-app</h1>
      <div className="content-wrapper">
        <NavigationMenu />
        <Trondheim />
      </div>
    </div>
  );
}

export default App;
