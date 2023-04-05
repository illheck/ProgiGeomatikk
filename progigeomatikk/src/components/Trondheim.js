import '../App.css';
import Map, {NavigationControl} from "react-map-gl";
import { useState } from 'react';



function Trondheim() {
  const [lng, setlng] = useState(10.421906);
  const [lat, setlat] = useState(63.426827);

  return (
    <div className="App">

      <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      style={
        {width: "100vw",
        height: "40vw",
        borderRadius: "15px"
        }
      }
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: 12
      }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      />
     
    </div>
  );
}

export default Trondheim;
