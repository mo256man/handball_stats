import React, { useState, useEffect, createContext } from 'react';
import Title from './components/Title.jsx';
import SelectMatch from './components/SelectMatch.jsx';
import SelectTeam from './components/SelectTeam.jsx';
import InputTable from './components/InputTable.jsx';
import './App.css'

function App() {
  const [view, setView] = useState("home");
  const [userId, setUserId] = useState(null);
  const [allTeams, setAllTeams] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [teams, setTeams] = useState([null, null]);
  const [currentSide, setCurrentSide] = useState(0);
  const [players, setPlayers] = useState([[], []]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchDate, setMatchDate] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [score1st, setScore1st] = useState([0, 0]);
  const [score2nd, setScore2nd] = useState([0, 0]);
  const [score, setScore] = useState([0, 0]);
  const [offenseTeam, setOffenseTeam] = useState(0);
  const [appOutputSheet, setAppOutputSheet] = useState(null);
  const [gks, setGks] = useState([null, null]);

  return (<>
    {(view === "home" || view === "menu") && <Title view={view} setView={setView} setAllTeams={setAllTeams} allTeams={allTeams} setAllPlayers={setAllPlayers} allPlayers={allPlayers} teams={teams} setTeams={setTeams} userId={userId} setUserId={setUserId} />}
    {(view === "selectMatch") && <SelectMatch view={view} setView={setView} setAllTeams={setAllTeams} allTeams={allTeams} setAllPlayers={setAllPlayers} allPlayers={allPlayers} teams={teams} setTeams={setTeams} players={players} setPlayers={setPlayers} currentMatch={currentMatch} setCurrentMatch={setCurrentMatch} userId={userId} matchDate={matchDate} setMatchDate={setMatchDate} matchId={matchId} setMatchId={setMatchId} />}
    {(view === "selectTeam") && <SelectTeam view={view} setView={setView} setAllTeams={setAllTeams} allTeams={allTeams} setAllPlayers={setAllPlayers} allPlayers={allPlayers} teams={teams} setTeams={setTeams} players={players} setPlayers={setPlayers} currentMatch={currentMatch} setCurrentMatch={setCurrentMatch} userId={userId} matchDate={matchDate} setMatchDate={setMatchDate} matchId={matchId} setMatchId={setMatchId} score1st={score1st} setScore1st={setScore1st} score2nd={score2nd} setScore2nd={setScore2nd} score={score} setScore={setScore} gks={gks} setGks={setGks} />}
    {(view === "inputTable") && <InputTable teams={teams} players={players} setView={setView} matchId={matchId} isEditor={false} matchDate={matchDate} offenseTeam={offenseTeam} setOffenseTeam={setOffenseTeam} appOutputSheet={appOutputSheet} setAppOutputSheet={setAppOutputSheet} score1st={score1st} setScore1st={setScore1st} score2nd={score2nd} setScore2nd={setScore2nd} score={score} setScore={setScore} session={null} gks={gks} />}
    </>
  );
}

export default App
