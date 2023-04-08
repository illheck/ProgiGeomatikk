import { useEffect, useState } from 'react';



function FileUpload(){
const [geojsonFile, setGeojsonFile] = useState(null);
const [map, setMap] = useState(null);
  
function handleFileChange(event) {
    const reader = new FileReader();
     const file = event.target.files[0];
     reader.onload = function() {
    const content = reader.result;
    const geojson = JSON.parse(content);
    setGeojsonFile(geojsonFile);
  };
  reader.readAsText(file);
}

function addFileToMap(map, geojson) {
  if (geojsonFile) {
    map.addSource('new-geojson-file', {
      type: 'geojson',
      data: geojsonFile,
    });
    map.addLayer({
      id: 'new-geojson-layer',
      type: 'line',
      source: 'new-geojson-file',
      paint: {
        'line-color': 'red',
        'line-width': 2,
      },
    });
  }


  
}
return(
    <div>
        <input type = "file" onChange={handleFileChange}/>
        <button onClick={addFileToMap(map, geojsonFile)}>Upload</button>
    </div>
  )
}

export default FileUpload;