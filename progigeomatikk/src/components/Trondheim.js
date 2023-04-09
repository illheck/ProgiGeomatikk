import '../App.css';
import Map, {NavigationControl} from "react-map-gl";
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';



mapboxgl.accessToken = "pk.eyJ1IjoiaWxsaGVjayIsImEiOiJjbGcyY203MHUwNDdtM2VtcHRqdHJ5aXlnIn0.hJ_PhF4QSRP6CPE2tKwY9A"


function Trondheim() {
  const [map, setMap] = useState(null);

  const [lng, setlng] = useState(10.421906);
  const [lat, setlat] = useState(63.426827);

  const [geojsonFile, setGeojsonFile] = useState(null);
  
  function handleFileChange(event) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.onload = function() {
      const content = reader.result;
      const geojson = JSON.parse(content);
      setGeojsonFile(geojson);
      setMap(map);
      
    };
    reader.readAsText(file);
  }

  function addFileToMap(map, geojson) {
    console.log(JSON.stringify(geojson))
    console.log(map)
    if (geojson) {
      const id = `new-source-${Math.floor(Math.random() * 1000)}`
      console.log(id)
      map.addSource(id, {
        type: 'geojson',
        data: geojson,
      });
      map.addLayer({
        id: id,
        type: 'line',
        source: id,
        paint: {
          'line-color': 'red',
          'line-width': 2,
        },
      });

    }
  }
  
  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: 'trondheim',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12,
    });
    setMap(newMap);
  }, []);


  return (
    <>
    <input type="file" onChange={handleFileChange}/>
    <button onClick={() => addFileToMap(map, geojsonFile)}>Upload</button>
    <div id="trondheim" style={{ height: '500px' }}>
      </div>
      </>
  );
}


export default Trondheim;
