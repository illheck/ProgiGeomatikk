

import React from 'react';

function NavigationMenu({ geojsonFile, fileName }) {
  return (
    <div className="NavigationMenu">
      <h2>Navigation Menu</h2>
      {fileName ? (
        <div>
          <h3>Uploaded File:</h3>
          <button onClick={() => { console.log("File clicked"); }}>
            {fileName}
          </button>
        </div>
      ) : (
        <p>No file uploaded</p>
      )}
    </div>
  );
}

export default NavigationMenu;