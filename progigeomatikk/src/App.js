import React, { useState } from 'react';
import NavigationMenu from './components/NavigationMenu';
import Trondheim from './components/Trondheim';
import './App.css';

function App() {
  const [geojsonFiles, setGeojsonFiles] = useState([]);

  const [idList, setIdList] = useState([]);
  const TrondheimRef = React.createRef();


  function handleDeleteFile(index) {
    const idToDelete = idList[index];

    setGeojsonFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setIdList(prevIdList => prevIdList.filter((_, i) => i !== index));

    if (TrondheimRef.current) {
      TrondheimRef.current.removeFileFromMap(idToDelete);
    }
  }

  return (
    <div className="App">
      <h1>GIS-app</h1>
      <div className="content-wrapper">
        <NavigationMenu geojsonFiles={geojsonFiles} handleDeleteFile={handleDeleteFile}/>
        <Trondheim 
          ref = {TrondheimRef}
          geojsonFiles={geojsonFiles} 
          setGeojsonFiles={setGeojsonFiles} 
          idList={idList} 
          setIdList={setIdList}
          handleDeleteFile={handleDeleteFile}
        />      </div>
    </div>
  );
}

export default App;