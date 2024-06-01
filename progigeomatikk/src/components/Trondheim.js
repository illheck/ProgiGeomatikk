import '../App.css';
import mapboxgl from 'mapbox-gl';
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

mapboxgl.accessToken = "pk.eyJ1IjoiaWxsaGVjayIsImEiOiJjbHVtaDU2Z2IxMHNrMmpsNTNtNjRiYzdiIn0.gWSqf7Sd1J_znIEDQ8E19Q";

const Trondheim = forwardRef(({ geojsonFiles, setGeojsonFiles, idList, setIdList, handleDeleteFile }, ref) => {
  const [lng, setlng] = useState(10.421906);
  const [lat, setlat] = useState(63.426827);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  function handleFileChange(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (!file) {
      // No file was selected, return early
      return;
    }
    reader.onload = function() {
      try {
        const content = reader.result;
        const geojson = JSON.parse(content);
        if (geojson && geojson.features) {
          setGeojsonFiles(prevFiles => [...prevFiles, { name: file.name, geojson }]);
        } else {
          console.error("Invalid geoJSON file");
        }
      } catch (error) {
        console.error("Error parsing geoJSON file", error);
      }
    };
    reader.readAsText(file);
  }

  function addFileToMap(map, geojson, id) {
    if (!map || !geojson) return;
    const type = geojson.features[0].geometry.type;
    map.addSource(id, {
      type: 'geojson',
      data: geojson,
    });
    if (type === "LineString") {
      map.addLayer({
        id: id,
        type: 'line',
        source: id,
        paint: {
          'line-color': 'red',
          'line-width': 2,
        },
      });
    } else if (type === "Point") {
      map.addLayer({
        id: id,
        type: 'circle',
        source: id,
        paint: {
          'circle-radius': 5,
          'circle-color': 'blue',
        }
      });
    } else if (type === 'MultiPolygon') {
      map.addLayer({
        id: id,
        type: 'fill',
        source: id,
        paint: {
          'fill-color': 'green',
          'fill-opacity': 0.5
        }
      });
    }
  }

  function removeFileFromMap(map, id) {
    if (map.getLayer(id)) {
      map.removeLayer(id);
      map.removeSource(id);
    }
  }

  useImperativeHandle(ref, () => ({
    removeFileFromMap(id) {
      if (mapRef.current) {
        removeFileFromMap(mapRef.current, id);
      }
    }
  }));

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

  useEffect(() => {
    if (mapRef.current && geojsonFiles.length) {
      const newFiles = geojsonFiles.slice(idList.length); // Only add new files
      newFiles.forEach((file, index) => {
        const id = `new-source-${idList.length + index}`;
        addFileToMap(mapRef.current, file.geojson, id);
        setIdList(prevIdList => [...prevIdList, id]);
      });
    }
  }, [geojsonFiles]);

  return (
    <>
      <div className='Trondheim'>
        <input type="file" onChange={handleFileChange} />
        <div ref={mapContainerRef} id="trondheim" style={{ height: '500px' }} />
      </div>
    </>
  );
});

export default Trondheim;