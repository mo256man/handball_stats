import React, { useState, useEffect, createContext } from 'react';
import irasutoya from '../assets/irasutoya.png'
import './Title.css'

const Title = ({ view, setView, setAllTeams, allTeams, setAllPlayers, allPlayers, socket }) => {
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    console.log('allTeams:', allTeams);
  }, [allTeams]);

  useEffect(() => {
    console.log('allPlayers:', allPlayers);
  }, [allPlayers]);

  const handleLogin = async () => {
    setPassError('');

    if (!username || !password) {
      setPassError('ユーザー名とパスワードを入力してください');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
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
        
        // チームデータ取得
        try {
          const teamsResponse = await fetch('http://localhost:3000/api/teams', {
            credentials: 'include'
          });
          if (teamsResponse.ok) {
            const teams = await teamsResponse.json();
            setAllTeams(teams);
            console.log('チームデータ:', teams);
          }
        } catch (err) {
          console.error('チームデータ取得エラー:', err);
        }

        // プレイヤーデータ取得
        try {
          const playersResponse = await fetch('http://localhost:3000/api/players', {
            credentials: 'include'
          });
          if (playersResponse.ok) {
            const players = await playersResponse.json();
            setAllPlayers(players);
            console.log('プレイヤーデータ:', players);
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
      await fetch('http://localhost:3000/api/logout', {
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
      <div className="btnLogin" onClick={handleLogout}>ログアウト</div>
      <div className="errorMessage">{passError}</div>
    </div>
  );


  return (
    <div id="base" className="bgTeam0" style={{ width: '50%' }}>
      <img src={irasutoya} className="backgroundImage"/>
      <div className="main">
        <div className="titleString">ハンドスタッツ入力支援</div>
      </div>
      <div className="footer">
        {view === "home" && renderPass}
        {view === "menu" && renderMenu}
      </div>
    </div>
  );
}

export default Title;
