import React, { useState } from 'react';
import * as turf from '@turf/turf';
import './GisPanel.css';
import { convertGeoJsonToTurf } from './geojsonToTurf';

function GisPanel({ geojsonFiles, setGeojsonFiles }) {
  const [result, setResult] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({ file1: null, file2: null });

  const handleFunctionChange = (event) => {
    setSelectedFunction(event.target.value);
    setSelectedFiles({ file1: null, file2: null });
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
    if (!selectedFiles.file1 || !selectedFiles.file2) {
      alert('Please select two GeoJSON files.');
      return false;
    }

    try {
      convertGeoJsonToTurf(selectedFiles.file1.geojson);
      convertGeoJsonToTurf(selectedFiles.file2.geojson);
    } catch (error) {
      alert(error.message);
      return false;
    }

    return true;
  };

  const handleRunFunction = () => {
    if (!validateInput()) return;

    try {
      const turfObj1 = convertGeoJsonToTurf(selectedFiles.file1.geojson);
      const turfObj2 = convertGeoJsonToTurf(selectedFiles.file2.geojson);

      let result;
      switch (selectedFunction) {
        case 'intersect':
          result = turf.intersect(turfObj1.features[0], turfObj2.features[0]);
          break;
        case 'union':
            result = turf.union(turfObj1.features[0], turfObj2.features[0]);
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
        setGeojsonFiles((prevFiles) => {
          console.log("Previous files:", prevFiles);
          console.log("Adding new file:", newFile);
          return [...prevFiles, newFile];
        });
      } else {
        alert('No intersection found.');
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
        {/* Add more options for other functionalities here */}
      </select>

      {selectedFunction && (
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