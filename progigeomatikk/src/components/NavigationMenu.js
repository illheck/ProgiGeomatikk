// src/App.js
import React from 'react';

function NavigationMenu() {
  // Legg til logikk for å vise filene i navigasjonsmenyen
  const files = ['file1.geojson', 'file2.geojson', 'file3.geojson'];

  return (
    <div className="navigation-menu">
    <h2>Filer</h2>
    <ul>
      {files.map((file, index) => (
        <li key={index}>{file}</li>
      ))}
    </ul>
  </div>
  );
}

export default NavigationMenu