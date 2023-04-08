import '../App.css';
import Map, {NavigationControl} from "react-map-gl";
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = "pk.eyJ1IjoiaWxsaGVjayIsImEiOiJjbGcyY203MHUwNDdtM2VtcHRqdHJ5aXlnIn0.hJ_PhF4QSRP6CPE2tKwY9A"


function Trondheim() {
  const [map, setMap] = useState(null);

  const [lng, setlng] = useState(10.421906);
  const [lat, setlat] = useState(63.426827);
  



  
  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12,
    });
    setMap(newMap);
  }, []);


  return (
    <div className="App">

      <div id="map" style={{ height: '500px' }}></div>
     
    </div>
  );
}

export default Trondheim;
