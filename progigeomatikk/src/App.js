import React, { useState } from 'react';
import NavigationMenu from './components/NavigationMenu';
import Trondheim from './components/Trondheim';
import GisPanel from './components/GisPanel';
import './App.css';

function App() {
  const [geojsonFiles, setGeojsonFiles] = useState([]); //Files uploaded
  const [idList, setIdList] = useState([]); //IDs of files uploaded
  const TrondheimRef = React.createRef(); //Reference to Trondheim-component


  //Takes index of the file to be deleted
  //Gets the id based on index
  //Removes the file from the geojson list and the id-list
  //Removes the file from the map if the map exists
  function handleDeleteFile(index) {
    const idToDelete = idList[index];

    setGeojsonFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setIdList((prevIdList) => prevIdList.filter((_, i) => i !== index));

    if (TrondheimRef.current) {
      TrondheimRef.current.removeFileFromMap(idToDelete);
    }
  }

  //Takes the index of a geojson file to be highlighted
  //Gets the file based on the index
  //Highlight the file, if the file and the map exists
  function handleHighlightFile(index) {
    const fileToHighlight = geojsonFiles[index];
    if (fileToHighlight && TrondheimRef.current) {
      TrondheimRef.current.highlightFileOnMap(fileToHighlight.geojson);
    }
  }


  //Sets Heading to name of course
  //Sets the three components in the application
  return (
    <div className="App">
      <h1>TBA4251 - Programmering i geomatikk</h1>
      <div className="content-wrapper">
        <NavigationMenu geojsonFiles={geojsonFiles} handleDeleteFile={handleDeleteFile} handleHighlightFile={handleHighlightFile}/>
        <GisPanel geojsonFiles={geojsonFiles} setGeojsonFiles={setGeojsonFiles} />
        <Trondheim
          ref={TrondheimRef}
          geojsonFiles={geojsonFiles}
          setGeojsonFiles={setGeojsonFiles}
          idList={idList}
          setIdList={setIdList}
        />
      </div>
    </div>
  );
}

export default App;