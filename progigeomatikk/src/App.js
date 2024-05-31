import { useState } from 'react';
import NavigationMenu from './components/NavigationMenu';
import Trondheim from './components/Trondheim';
import './App.css'; // Ensure you import the CSS file

function App() {

  const [geojsonFile, setGeojsonFile] = useState(null)
  const [fileName, setFileName] = useState('')

  return (
    <div className="App">
      <h1>GIS-app</h1>
      <div className="content-wrapper">
        <NavigationMenu geojsonFile={geojsonFile} fileName={fileName}/>
        <Trondheim geojsonFile={geojsonFile} setGeojsonFile={setGeojsonFile} setFileName={setFileName}/>
      </div>
    </div>
  );
}

export default App;