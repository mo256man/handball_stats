import React, { useState, useEffect, createContext } from 'react';
import Title from './components/Title';
import './App.css'

function App() {
  const [view, setView] = useState("home");


  return (
    <>{view === "home" && <Title />}</>
  );
}

export default App
