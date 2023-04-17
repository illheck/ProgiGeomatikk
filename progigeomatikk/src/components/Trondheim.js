import '../App.css';
import Map, {NavigationControl} from "react-map-gl";
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken = "pk.eyJ1IjoiaWxsaGVjayIsImEiOiJjbGcyY203MHUwNDdtM2VtcHRqdHJ5aXlnIn0.hJ_PhF4QSRP6CPE2tKwY9A"


function Trondheim() {
  const [map, setMap] = useState(null);
  const [id, setId] = useState(null);

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
    const type = geojson.features[0].geometry.type;
    console.log(type)
    if (geojson) {
      const id = `new-source-${Math.floor(Math.random() * 1000)}`
      console.log(id)
      setId(id);
      map.addSource(id, {
        type: 'geojson',
        data: geojson,
      });
      if (type === "LineString"){ 
          map.addLayer({
            id: id,
            type: 'line',
            source: id,
            paint: {
              'line-color': 'red',
              'line-width': 2,
            },
          });}
      if (type === "Point"){
        map.addLayer({
          id: id,
          type: 'circle',
          source: id,
          paint:{
            'circle-radius': 5,
            'circle-color': 'blue',
          }
        })
      }
      if (type === 'MultiPolygon'){
        map.addLayer({
          id: id,
          type: 'fill',
          source: id,
          paint:{
            'fill-color': 'green',
            'fill-opacity': 0.5
          }
        })
      }
    }
  }

  function removeFile(map, geojson){
    if (map.getLayer(id)){
      map.removeLayer(id);
      map.removeSource(id);
    }
  }


  function markGeoJSON(map){
    map.on('click', id, (e) => {
      const feature = e.feature[0];
      const coor = feature.geometry.coordinates.slice();
      

      const marker = new mapboxgl.Marker().setLngLat(coor).addTo(map)
      const popUp = new mapboxgl.Popup().setHTML('<h1>hei<h1>')

      marker.setPopup(popUp)
      map.flyTo({
        center: coor,
        zoom: 10
      });
    })
  }


  
  useEffect(() => {
    setMap(new mapboxgl.Map({
      container: 'trondheim',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12,
    }));
}, []);


  return (
    <>
    <input type="file" onChange={handleFileChange}/>
    <button onClick={() => addFileToMap(map, geojsonFile)}>Upload</button>
    <button onClick={() => removeFile(map, geojsonFile)}>Delete</button>
    <div id="trondheim" style={{ height: '500px' }}>
      
      </div>
      </>
  );
}


export default Trondheim;
