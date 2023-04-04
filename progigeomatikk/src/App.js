import logo from './logo.svg';
import './App.css';
import Map, {Marker} from "react-map-gl";
import { useState } from 'react';


function App() {
  const [lng, setlng] = useState(10.421906);
  const [lat, setlat] = useState(63.406827);

  return (
    <div className="App">

      <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      style={
        {width: "70vw",
        height: "50vw",
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
