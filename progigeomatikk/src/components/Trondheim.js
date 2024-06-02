import '../App.css';
import mapboxgl from 'mapbox-gl';
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as turf from '@turf/turf';


mapboxgl.accessToken = "pk.eyJ1IjoiaWxsaGVjayIsImEiOiJjbHVtaDU2Z2IxMHNrMmpsNTNtNjRiYzdiIn0.gWSqf7Sd1J_znIEDQ8E19Q";

const Trondheim = forwardRef(({ geojsonFiles, setGeojsonFiles, idList, setIdList, handleDeleteFile }, ref) => {
  const [lng, setLng] = useState(10.421906);
  const [lat, setLat] = useState(63.426827);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  function addFileToMap(map, geojson, id) {
    if (!map || !geojson) return;
    if (!geojson.features || geojson.features.length === 0) {
      console.error("Invalid GeoJSON: No features found.");
      return;
    }

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
    } else if (type === 'MultiPolygon' || type === 'Polygon') {
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const geojson = JSON.parse(reader.result);
          if (geojson.features) {
            setGeojsonFiles(prevFiles => [...prevFiles, { name: file.name, geojson }]);
          } else {
            alert("Invalid GeoJSON file.");
          }
        } catch (e) {
          alert("Error reading GeoJSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  function highlightFileOnMap(geojson) {
    if (!mapRef.current || !geojson) return;
    const bbox = turf.bbox(geojson);
    mapRef.current.fitBounds(bbox, { padding: 20 });
  }

  useImperativeHandle(ref, () => ({
    removeFileFromMap(id) {
      if (mapRef.current) {
        removeFileFromMap(mapRef.current, id);
      }
    },
    highlightFileOnMap(geojson) {
      highlightFileOnMap(geojson);
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
      console.log("New files to add:", newFiles);
      newFiles.forEach((file, index) => {
        const id = `new-source-${idList.length + index}`;
        console.log("Adding file to map:", file.name, id);
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