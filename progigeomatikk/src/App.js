import React from 'react';
import NavigationMenu from './components/NavigationMenu';
import Trondheim from './components/Trondheim';
import './App.css'; // Ensure you import the CSS file

function App() {
  return (
    <div className="App">
      <h1>GIS-app</h1>
      <div className="content-wrapper">
        <NavigationMenu />
        <Trondheim />
      </div>
    </div>
  );
}

export default App;