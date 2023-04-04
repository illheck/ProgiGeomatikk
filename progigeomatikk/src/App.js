import logo from './logo.svg';
import './App.css';
import Map, {Marker} from "react-map-gl";
import { useState } from 'react';


function App() {
  const [lng, setlng] = useState(10.421906);
  const [lat, setlat] = useState(63.446827);

  return (
    <div className="App">
      <h1>Hei</h1>
      <Map
      mapboxAccessToken='pk.eyJ1IjoiaWxsaGVjayIsImEiOiJja3poNDlqODAxNzJxMnZueXo1a3BrNHF0In0.OXM8RqhO-dOV7wG6-_zkTQ'
      style={
        {width: "500px",
        height: "500px",
        borderRadius: "15px",
        border: '2px solid red'}
      }
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: 10
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </div>
  );
}

export default App;
