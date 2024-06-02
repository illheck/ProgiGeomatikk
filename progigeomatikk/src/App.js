import React, { useState } from 'react';
import NavigationMenu from './components/NavigationMenu';
import Trondheim from './components/Trondheim';
import GisPanel from './components/GisPanel';
import './App.css';

function App() {
  const [geojsonFiles, setGeojsonFiles] = useState([]);
  const [idList, setIdList] = useState([]);
  const TrondheimRef = React.createRef();

  function handleDeleteFile(index) {
    const idToDelete = idList[index];

    setGeojsonFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setIdList((prevIdList) => prevIdList.filter((_, i) => i !== index));

    if (TrondheimRef.current) {
      TrondheimRef.current.removeFileFromMap(idToDelete);
    }
  }

  function handleHighlightFile(index) {
    const fileToHighlight = geojsonFiles[index];
    if (fileToHighlight && TrondheimRef.current) {
      TrondheimRef.current.highlightFileOnMap(fileToHighlight.geojson);
    }
  }

  return (
    <div className="App">
      <h1>GIS-app</h1>
      <div className="content-wrapper">
        <NavigationMenu geojsonFiles={geojsonFiles} handleDeleteFile={handleDeleteFile} handleHighlightFile={handleHighlightFile}/>
        <GisPanel geojsonFiles={geojsonFiles} setGeojsonFiles={setGeojsonFiles} />
        <Trondheim
          ref={TrondheimRef}
          geojsonFiles={geojsonFiles}
          setGeojsonFiles={setGeojsonFiles}
          idList={idList}
          setIdList={setIdList}
          handleDeleteFile={handleDeleteFile}
        />
      </div>
    </div>
  );
}

export default App;