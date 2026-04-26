import React, { useState, useEffect, createContext } from 'react';
import irasutoya from '../assets/irasutoya.png'
import './Title.css'

const API_BASE = `http://${window.location.hostname}:3000`;

const Title = ({ view, setView, setAllTeams, allTeams, setAllPlayers, allPlayers, teams, setTeams, userId, setUserId }) => {
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    setPassError('');

    if (!username || !password) {
      setPassError('ユーザー名とパスワードを入力してください');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('ログイン成功:', data);
        setUserId(data.userId);
        
        // チームデータ取得
        try {
          const teamsResponse = await fetch(`${API_BASE}/api/teams`, {
            credentials: 'include'
          });
          if (teamsResponse.ok) {
            const teamsList = await teamsResponse.json();
            setAllTeams(teamsList);
            
            // teamId に一致するチームデータを teams[0] に設定
            if (data.teamId) {
              const teamData = teamsList.find(team => team.teamId === data.teamId);
              if (teamData) {
                const newTeams = [...teams];
                newTeams[0] = teamData;
                setTeams(newTeams);
              }
            }
          }
        } catch (err) {
          console.error('チームデータ取得エラー:', err);
        }

        // プレイヤーデータ取得
        try {
          const playersResponse = await fetch(`${API_BASE}/api/players`, {
            credentials: 'include'
          });
          if (playersResponse.ok) {
            const players = await playersResponse.json();
            setAllPlayers(players);
          }
        } catch (err) {
          console.error('プレイヤーデータ取得エラー:', err);
        }
        
        setView("menu");
      } else {
        const error = await response.json();
        setPassError(error.error || 'ログインに失敗しました');
      }
    } catch (err) {
      setPassError('通信エラーが発生しました');
      console.error(err);
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (err) {
      console.error('ログアウトエラー:', err);
    }
    
    setUsername("");
    setPassword("");
    setPassError("");
    setUserId(null);
    setView("home");
    setAllTeams([]);
    setAllPlayers([]);
  }

  const renderPass = (
    <div id="pass">
      <input
        className="passName"
        type="text"
        placeholder="名前"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        className="passName"
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div className="btnLogin" onClick={handleLogin}>ログイン</div>
      <div className="errorMessage">{passError}</div>
    </div>
  );

  const renderMenu = (
    <div id="menu">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: "70%", margin: "0 auto" }}>
        <div className="btnTitle" onClick={() => { setView('selectMatch'); }}>
          <div className="fontNormal">記入</div>
          <div className="fontLarge">📝</div>
        </div>
        <div className="btnTitle" onClick={() => { 
          setView('outputMenu'); 
          setIsEditor(false); 
        }}>
          <div className="fontNormal">閲覧</div>
          <div className="fontLarge">📊</div>
        </div>
        <div className="btnTitle" onClick={() => { setView('settingsMenu'); setIsEditor(false); }}>
          <div className="fontNormal">設定</div>
          <div className="fontLarge">🔧</div>
        </div>
      </div>
      <div className="btnLogin" onClick={handleLogout}>ログアウト</div>
      <div className="errorMessage">{passError}</div>
    </div>
  );


  return (
    <div id="base" className="bgTeam0" style={{ width: '50%' }}>
      <img src={teams[0]?.image || irasutoya} className="backgroundImage"/>
      <div className="main">
        <div className="titleString">ハンドスタッツ入力支援</div>
        {teams[0]?.teamName && (
          <div className="titleTeamName">{teams[0].teamName}</div>
        )}
      </div>
      <div className="footer">
        {view === "home" && renderPass}
        {view === "menu" && renderMenu}
      </div>
    </div>
  );
}

export default Title;
