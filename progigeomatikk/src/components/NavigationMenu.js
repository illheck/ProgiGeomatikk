import React from 'react';
import './NavigationMenu.css';


function NavigationMenu({ geojsonFiles, handleDeleteFile, handleHighlightFile }) {


  const handleDownloadFile = (file) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file.geojson));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", file.name);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };


  return (
    <div className="NavigationMenu">
      <h2>Files</h2>
      {geojsonFiles.length > 0 ? (
        <ul>
          {geojsonFiles.map((file, index) => (
              <li key={index}>
              <div className="file-name">{file.name}</div>
              <div className="button-group">
                <button onClick={() => handleHighlightFile(index)}>Highlight</button>
                <button onClick={() => handleDeleteFile(index)}>Delete</button>
                <button onClick={() => handleDownloadFile(file)}>Download</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files uploaded</p>
      )}
    </div>
  );
}

export default NavigationMenu;