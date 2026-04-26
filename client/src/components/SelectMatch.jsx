import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { Player } from './Player';
import './Calendar.css';

const API_BASE = `http://${window.location.hostname}:3000`;

const SelectMatch = ({ view, setView, setAllTeams, allTeams, setAllPlayers, allPlayers, teams, setTeams, players, setPlayers, currentMatch, setCurrentMatch, userId, matchDate, setMatchDate, matchId, setMatchId }) => {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  const [selectedDate, setSelectedDate] = useState(today);
  const [matchDates, setMatchDates] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // チームIDからチーム名を取得
  const getTeamName = (teamId) => {
    const team = allTeams.find(t => t.teamId === teamId);
    return team ? team.teamName : `Team ${teamId}`;
  };

  // マッチテーブルの日付を取得（userIdでフィルタリング）
  useEffect(() => {
    const loadMatchDates = async () => {
      try {
        setLoadingDates(true);
        const response = await fetch(`${API_BASE}/api/match-dates`, {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        const result = await response.json();
        if (result.success) {
          setMatchDates(result.dates || []);
        } else {
          console.error('試合日付取得エラー:', result.error);
        }
      } catch (error) {
        console.error('試合日付の取得エラー:', error);
      } finally {
        setLoadingDates(false);
      }
    };
    if (userId) loadMatchDates();
  }, [userId]);

  // 選択日付が変わったときにマッチデータを取得（userIdでフィルタリング）
  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoadingMatches(true);
        const response = await fetch(`${API_BASE}/api/getMatches`, {
          credentials: 'include',
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: selectedDate })
        });
        const result = await response.json();
        if (result.success) {
          setMatches(result.matches || []);
        } else {
          console.error('マッチデータ取得エラー:', result.error);
        }
      } catch (error) {
        console.error('マッチデータの取得エラー:', error);
      } finally {
        setLoadingMatches(false);
      }
    };
    loadMatches();
  }, [selectedDate]);

  // 既存マッチを選択する場合の処理
  const handleSelectMatch = async (match) => {
    try {
      const response = await fetch(`${API_BASE}/api/getRecordsByMatchId`, {
        credentials: 'include',
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams, matchId: match.id })
      });
      const result = await response.json();
      const records = result.success ? (result.data || []) : [];
      const selectedMatchData = { match, records };
      
      // teams[0]と teams[1]を設定
      const team0 = allTeams.find(t => t.teamId === match.team0);
      const team1 = allTeams.find(t => t.teamId === match.team1);
      setTeams([team0, team1]);
      
      // players0/players1をパースしてisOnBenchを設定
      const playerIds0 = match.players0 ? String(match.players0).split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)) : [];
      const playerIds1 = match.players1 ? String(match.players1).split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)) : [];
      
      const playersForTeam0 = allPlayers
        .filter(p => p.teamId === match.team0)
        .map(p => new Player({ ...p, isOnBench: playerIds0.includes(p.playerId) }));
      const playersForTeam1 = allPlayers
        .filter(p => p.teamId === match.team1)
        .map(p => new Player({ ...p, isOnBench: playerIds1.includes(p.playerId) }));
      
      setPlayers([playersForTeam0, playersForTeam1]);
      
      setCurrentMatch(selectedMatchData);
      setMatchId(match.id);
      setMatchDate(match.date);
      setView('selectTeam');
    } catch (err) {
      console.error('records取得エラー:', err);
      const selectedMatchData = { match, records: [] };
      
      // teams[0]と teams[1]を設定
      const team0 = allTeams.find(t => t.teamId === match.team0);
      const team1 = allTeams.find(t => t.teamId === match.team1);
      setTeams([team0, team1]);
      
      // players0/players1をパースしてisOnBenchを設定
      const playerIds0 = match.players0 ? String(match.players0).split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)) : [];
      const playerIds1 = match.players1 ? String(match.players1).split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)) : [];
      
      const playersForTeam0 = allPlayers
        .filter(p => p.teamId === match.team0)
        .map(p => new Player({ ...p, isOnBench: playerIds0.includes(p.playerId) }));
      const playersForTeam1 = allPlayers
        .filter(p => p.teamId === match.team1)
        .map(p => new Player({ ...p, isOnBench: playerIds1.includes(p.playerId) }));
      
      setPlayers([playersForTeam0, playersForTeam1]);
      
      setCurrentMatch(selectedMatchData);
      setMatchId(match.id);
      setMatchDate(match.date);
      setView('selectTeam');
    }
  };

  // 新規試合登録の処理
  const handleCreateNewMatch = () => {
    setMatchDate(selectedDate);
    setView("selectTeam");
  };

  const renderMatches = () => {
    if (loadingMatches) {
      return <div className="matches-loading">マッチデータ読み込み中...</div>;
    }

    return (
      <div className="matches-container">
        {matches.length === 0 && (
          <div className="matches-empty">この日付のマッチデータはありません</div>
        )}

        {matches.map((match, index) => (
          <div
            key={match.id || index}
            className="match-item"
            onClick={() => handleSelectMatch(match)}
          >
            <div className="match-teams">
              {getTeamName(match.team0)} vs {getTeamName(match.team1)}
            </div>
          </div>
        ))}

        <div
          className="match-item new-match-button"
          onClick={handleCreateNewMatch}
        >
          <div className="match-teams">+ 新規試合登録</div>
        </div>
      </div>
    );
  }

  return (
    <div id="base" className="bgTeam0">
      <div className="main">
        <div onClick={() => setView("menu")} className="btnBack">🔙</div>
        <div className="titleString">試合選択</div>
        {loadingDates ? (
          <div>読み込み中...</div>
        ) : (
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            highlightedDates={matchDates}
            showTodayButtonInHeader={true}
          />
        )}
        {renderMatches()}
      </div>
    </div>
  );
}

export default SelectMatch;
