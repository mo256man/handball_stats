import React, { useState, useEffect, createContext } from 'react';
import Title from './components/Title';
import './App.css'

function App() {
  const [view, setView] = useState<string>("home");
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);


  return (
    <>{(view === "home" || view === "menu") && <Title view={view} setView={setView} setAllTeams={setAllTeams} allTeams={allTeams} setAllPlayers={setAllPlayers} allPlayers={allPlayers} />}</>
  );
}

export default App
