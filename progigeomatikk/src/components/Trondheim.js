import '../App.css';
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken = "pk.eyJ1IjoiaWxsaGVjayIsImEiOiJjbHVtaDU2Z2IxMHNrMmpsNTNtNjRiYzdiIn0.gWSqf7Sd1J_znIEDQ8E19Q"


function Trondheim({geojsonFile, setGeojsonFile, setFileName}) {
  const [id, setId] = useState(null);

  const [lng] = useState(10.421906);
  const [lat] = useState(63.426827);


  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  
  function handleFileChange(event) {
      const reader = new FileReader();
      const file = event.target.files[0];
      setFileName(file.name)
      reader.onload = function() {
        try{
          const content = reader.result;
          const geojson = JSON.parse(content);
          if (geojson && geojson.features){
          setGeojsonFile(geojson);}
          else{
            console.error("Invalid geoJSON file");
            setGeojsonFile(null);
          }
        }
        catch (error) {
          console.error("Error parsing geoJSON file", error);
          setGeojsonFile(null)
        }
       };
    reader.readAsText(file);
  };


  function addFileToMap(map, geojson) {
    if (!map || !geojson) return;
    const type = geojson.features[0].geometry.type;
    console.log(type)

    const id = `new-source-${Math.floor(Math.random() * 1000)}`
    console.log(id)

    console.log(JSON.stringify(geojson))
    console.log(map)
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
    return id
  
}

  function removeFile(map, id){
    if (map.getLayer(id)){
      map.removeLayer(id);
      map.removeSource(id);
    }
  }


  // function markGeoJSON(map){
  //   map.on('click', id, (e) => {
  //     const feature = e.feature[0];
  //     const coor = feature.geometry.coordinates.slice();
      

  //     const marker = new mapboxgl.Marker().setLngLat(coor).addTo(map)
  //     const popUp = new mapboxgl.Popup().setHTML('<h1>hei<h1>')

  //     marker.setPopup(popUp)
  //     map.flyTo({
  //       center: coor,
  //       zoom: 10
  //     });
  //   })
  // }
  
  useEffect(() => {
    if (mapRef.current) return; // If map already exists, do not recreate it
  
    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12,
    });
  
    mapRef.current = newMap; // Store map instance in ref
  }, []);


  return (
    <>
    <div className='Trondheim'>
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => {
        if (mapRef.current && geojsonFile) {
          const id = addFileToMap(mapRef.current, geojsonFile);
          setId(id); // Store the generated ID for future reference
        }
      }}>
        Upload
      </button>
      <button onClick={() => {
        if (mapRef.current && id) {
          removeFile(mapRef.current, id);
        }
      }}>
        Delete
      </button>
      <div ref={mapContainerRef} id="trondheim" style={{ height: '500px' }} />
      </div>
    </>
  );
}


export default Trondheim;
