import React from 'react';
import './App.css';
import GraphComponent from './Node';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Example with 5 nodes</h2>
        <GraphComponent/>
      </header>
    </div>
  );
}

export default App;