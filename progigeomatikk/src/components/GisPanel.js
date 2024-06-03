import React, { useState } from 'react';
import * as turf from '@turf/turf';
import './GisPanel.css';
import { convertGeoJsonToTurf } from './geojsonToTurf';

function GisPanel({ geojsonFiles, setGeojsonFiles }) {
  const [result, setResult] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({ file1: null, file2: null });
  const [bufferDistance, setBufferDistance] = useState(0);

  const handleFunctionChange = (event) => {
    setSelectedFunction(event.target.value);
    setSelectedFiles({ file1: null, file2: null });
    setBufferDistance(0);
    setResult(null);
  };

  const handleFileChange = (event, fileKey) => {
    const selectedIndex = event.target.selectedIndex;
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [fileKey]: geojsonFiles[selectedIndex - 1],
    }));
  };

  const validateInput = () => {
    if (selectedFunction === 'buffer') {
      if (!selectedFiles.file1) {
        alert('Please select a GeoJSON file.');
        return false;
      }
      if (bufferDistance <= 0) {
        alert('Please enter a valid buffer distance.');
        return false;
      }
    } else if (selectedFunction === 'union' || selectedFunction === 'intersect') {
      if (!selectedFiles.file1 || !selectedFiles.file2) {
        alert('Please select two GeoJSON files.');
        return false;
      }
    }

    try {
      if (selectedFunction === 'buffer') {
        convertGeoJsonToTurf(selectedFiles.file1.geojson, ['MultiPolygon', 'Polygon', 'LineString', 'Point']);
      } else {
        convertGeoJsonToTurf(selectedFiles.file1.geojson, ['MultiPolygon', 'Polygon']);
        convertGeoJsonToTurf(selectedFiles.file2.geojson, ['MultiPolygon', 'Polygon']);
      }
    } catch (error) {
      alert(error.message);
      return false;
    }

    return true;
  };

  const handleRunFunction = () => {
    if (!validateInput()) return;

    try {
      const turfObj1 = convertGeoJsonToTurf(selectedFiles.file1.geojson, selectedFunction === 'buffer' ? ['MultiPolygon', 'Polygon', 'LineString', 'Point'] : ['MultiPolygon', 'Polygon']);
      let result;
      switch (selectedFunction) {
        case 'intersect':
          const turfObj2 = convertGeoJsonToTurf(selectedFiles.file2.geojson, ['MultiPolygon', 'Polygon']);
          result = turf.intersect(turfObj1.features[0], turfObj2.features[0]);
          break;
        case 'union':
          const unionTurfObj2 = convertGeoJsonToTurf(selectedFiles.file2.geojson, ['MultiPolygon', 'Polygon']);
          result = turf.union(turfObj1.features[0], unionTurfObj2.features[0]);
          break;
        case 'buffer':
          result = turf.buffer(turfObj1.features[0], bufferDistance, { units: 'meters' });
          break;
        default:
          alert('Selected function is not implemented.');
          return;
      }

      if (result) {
        const resultGeojson = {
          type: 'FeatureCollection',
          features: [result]
        };
        const newFile = {
          name: `Result_${Date.now()}.geojson`,
          geojson: resultGeojson,
        };
        setResult(resultGeojson);
        setGeojsonFiles((prevFiles) => [...prevFiles, newFile]);
      } else {
        alert('No result found.');
      }
    } catch (error) {
      console.error('Error performing function:', error);
    }
  };

  return (
    <div className="gisPanel">
      <h2>GIS Panel</h2>
      <select value={selectedFunction} onChange={handleFunctionChange}>
        <option value="">Select Functionality</option>
        <option value="intersect">Intersect</option>
        <option value="union">Union</option>
        <option value="buffer">Buffer</option>
      </select>

      {selectedFunction === 'buffer' && (
        <div>
          <label>
            Select File:
            <select onChange={(event) => handleFileChange(event, 'file1')}>
              <option value="">Select a file</option>
              {geojsonFiles.map((file, index) => (
                <option key={index} value={index}>
                  {file.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Buffer Distance (meters):
            <input 
              type="number" 
              value={bufferDistance} 
              onChange={(event) => setBufferDistance(event.target.value)} 
            />
          </label>

          <button onClick={handleRunFunction}>Run</button>
        </div>
      )}

      {(selectedFunction === 'intersect' || selectedFunction === 'union') && (
        <div>
          <label>
            Select File 1:
            <select onChange={(event) => handleFileChange(event, 'file1')}>
              <option value="">Select a file</option>
              {geojsonFiles.map((file, index) => (
                <option key={index} value={index}>
                  {file.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Select File 2:
            <select onChange={(event) => handleFileChange(event, 'file2')}>
              <option value="">Select a file</option>
              {geojsonFiles.map((file, index) => (
                <option key={index} value={index}>
                  {file.name}
                </option>
              ))}
            </select>
          </label>

          <button onClick={handleRunFunction}>Run</button>
        </div>
      )}

      {result && (
        <div>
          <h3>Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default GisPanel;