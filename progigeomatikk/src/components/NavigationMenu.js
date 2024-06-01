import React from 'react';

function NavigationMenu({ geojsonFiles, handleDeleteFile }) {
  return (
    <div className="NavigationMenu">
      <h2>Navigation Menu</h2>
      {geojsonFiles.length > 0 ? (
        <ul>
          {geojsonFiles.map((file, index) => (
            <li key={index}>
              {file.name}
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