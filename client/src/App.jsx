import React, { useState, useEffect, createContext } from 'react';
import Title from './components/Title.jsx';
import './App.css'

function App() {
  const [view, setView] = useState("home");
  const [allTeams, setAllTeams] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);


  return (
    <>{(view === "home" || view === "menu") && <Title view={view} setView={setView} setAllTeams={setAllTeams} allTeams={allTeams} setAllPlayers={setAllPlayers} allPlayers={allPlayers} />}</>
  );
}

export default App
