import React from 'react';

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
              {file.name}
              <button onClick={() => handleHighlightFile(index)}>Highlight</button>
              <button onClick={() => handleDownloadFile(file)}>Download</button>
              <button onClick={() => handleDeleteFile(index)}>Delete</button>
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