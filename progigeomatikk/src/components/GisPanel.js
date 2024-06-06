import React, { useState } from 'react';
import * as turf from '@turf/turf';
import './GisPanel.css';
import { convertGeoJsonToTurf } from './geojsonToTurf';

const GisPanel = ({ geojsonFiles, setGeojsonFiles }) => {
  const [result, setResult] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({ file1: null, file2: null });
  const [bufferDistance, setBufferDistance] = useState(0);
  const [areaResult, setAreaResult] = useState(null); 

  //Handles a change in the function
  const handleFunctionChange = (event) => {
    setSelectedFunction(event.target.value);
    setSelectedFiles({ file1: null, file2: null });
    setBufferDistance(0);
    setResult(null);
    setAreaResult(null); 
    
  };


  //Handles change in chosen file(s)
  const handleFileChange = (event, fileKey) => {
    const selectedIndex = event.target.selectedIndex;
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [fileKey]: geojsonFiles[selectedIndex - 1],
    }));
  };

  //Function to validate input
  const validateInput = () => {
    //Checks for geojson file, and that the bufferdistance is more than 0
    if (selectedFunction === 'buffer') {
      if (!selectedFiles.file1) {
        alert('Please select a GeoJSON file.');
        return false;
      }
      if (bufferDistance <= 0) {
        alert('Please enter a valid buffer distance.');
        return false;
      }
      //Checks for geojson-file
    } else if (selectedFunction === 'union' || selectedFunction === 'intersect') {
      if (!selectedFiles.file1 || !selectedFiles.file2) {
        alert('Please select two GeoJSON files.');
        return false;
      }
    } else if (selectedFunction === 'area' || selectedFunction === 'centroid') {
      if (!selectedFiles.file1) {
        alert('Please select a GeoJSON file.');
        return false;
      }
    }

    return true;
  };

  //Creates a union of one or more multipolygons
  const unionAllFeatures = (geojson) => {
    let combinedFeature = geojson.features[0];
    for (let i = 1; i < geojson.features.length; i++) {
      combinedFeature = turf.union(combinedFeature, geojson.features[i]);
    }
    return combinedFeature;
  };

  const handleRunFunction = () => {
    //Checks that all inputs are OK
    if (!validateInput()) return;

    try {
      let result;
      switch (selectedFunction) {

        //Converts the files into turf-objects, creates a union of all multipolygons in the two files and then creates intersected file of the two files
        case 'intersect':
          const intersectTurfObj1 = convertGeoJsonToTurf(selectedFiles.file1.geojson, ['MultiPolygon', 'Polygon']);
          const unionTurfObj1 = unionAllFeatures(intersectTurfObj1);
          const intersectTurfObj2 = convertGeoJsonToTurf(selectedFiles.file2.geojson, ['MultiPolygon', 'Polygon']);
          const unionTurfObj2 = unionAllFeatures(intersectTurfObj2);
          result = turf.intersect(unionTurfObj1, unionTurfObj2);
          break;

        //Converts the files into turf-objects, creates a union of all multipolygons in the two files and then creates the union of the two files
        case 'union':
          const unionTurfObj1ForUnion = convertGeoJsonToTurf(selectedFiles.file1.geojson, ['MultiPolygon', 'Polygon']);
          const unionTurfObj1Combined = unionAllFeatures(unionTurfObj1ForUnion);
          const unionTurfObj2ForUnion = convertGeoJsonToTurf(selectedFiles.file2.geojson, ['MultiPolygon', 'Polygon']);
          const unionTurfObj2Combined = unionAllFeatures(unionTurfObj2ForUnion);
          result = turf.union(unionTurfObj1Combined, unionTurfObj2Combined);
          break;

        //Converts files into turf objects
        //The buffer functionality can handle all input features. 
        //Iterates over all features in the file, and creates their buffer geojson
        // All objects are added into new result file
        case 'buffer':
          const bufferTurfObj = convertGeoJsonToTurf(selectedFiles.file1.geojson, ['MultiPolygon', 'Polygon', 'LineString', 'Point']);
          const bufferedFeatures = bufferTurfObj.features.map(feature => turf.buffer(feature, bufferDistance, { units: 'meters' }));
          result = turf.featureCollection(bufferedFeatures);
          break;

        //Converts a polygon or multipolygon to a turfobject
        //Creates union of all features in the geojson file
        //Find the area of the union feature
        //Set result with two decimals
        case 'area':
          const areaTurfObj = convertGeoJsonToTurf(selectedFiles.file1.geojson, ['MultiPolygon', 'Polygon']);
          const areaTurfObjCombined = unionAllFeatures(areaTurfObj);
          const area = turf.area(areaTurfObjCombined);
          setAreaResult(area.toFixed(2));
          return;

        //Converts polygon or multipolygon to a turf object
        //Creates union of all features in the geojson file
        //Finds the centroid and stores it
        case 'centroid':
          const centroidTurfObj = convertGeoJsonToTurf(selectedFiles.file1.geojson, ['Polygon', 'MultiPolygon']);
          const centroids = centroidTurfObj.features.map(feature => turf.centroid(feature));
          result = turf.featureCollection(centroids);
          break;
        default:
          alert('Selected function is not implemented.');
          return;
      }

      //Saves the result (if it exists) as a file with a random name and adds it to the list of geojson files (in the naigation menu and the map)
      if (result) {
        const resultGeojson = {
          type: 'FeatureCollection',
          features: result.features || [result]
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

  //Dropdown menu with all functionality
  //Checks what functionality is chosen and chooses JSX thereafter
  //Input file and Input-field for buffer distance if buffer is chosen
  //If intersect or union is chosen, there are two input files
  //If area or centroid is chosen, only one input fiels is shown.
  //All fields have a button that initializes "handleRunFunction()" if it is pushed
  //Shows result geojson-file or the result area
  return (
    <div className="gisPanel">
      <h2>GIS Panel</h2>
      <select value={selectedFunction} onChange={handleFunctionChange}>
        <option value="">Select Functionality</option>
        <option value="intersect">Intersect</option>
        <option value="union">Union</option>
        <option value="buffer">Buffer</option>
        <option value="area">Area of a Polygon</option>
        <option value="centroid">Center of a polygon</option>
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

      {selectedFunction === 'area' && (
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
          <button onClick={handleRunFunction}>Run</button>
        </div>
      )}
        {selectedFunction === 'centroid' && (
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
                <button onClick={handleRunFunction}>Run</button>
                </div>
            )}

      {result && (
        <div>
          <h3>Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {areaResult && ( 
        <div>
          <h3>Area Result</h3>
          <p>{`Area: ${areaResult} m^2`}</p>
        </div>
      )}
    </div>
  );
}

export default GisPanel;