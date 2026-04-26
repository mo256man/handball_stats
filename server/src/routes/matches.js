import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// マッチテーブルの日付リストを取得（userIdでフィルタリング）
router.post('/match-dates', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const query = 'SELECT DISTINCT date FROM match WHERE userId = ? AND date IS NOT NULL ORDER BY date';
  
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      res.json({ success: false, error: 'サーバーエラー' });
      return;
    }

    const dates = (rows || []).map(row => row.date);
    res.json({ success: true, dates });
  });
});

// 選択日付のマッチデータを取得（userIdでフィルタリング）
router.post('/getMatches', requireAuth, (req, res) => {
  const { date } = req.body;
  const userId = req.session.userId;

  if (!date) {
    res.json({ success: false, error: '日付が指定されていません' });
    return;
  }

  const query = 'SELECT * FROM match WHERE userId = ? AND date = ? ORDER BY id';
  
  db.all(query, [userId, date], (err, rows) => {
    if (err) {
      console.error(err);
      res.json({ success: false, error: 'サーバーエラー' });
      return;
    }

    res.json({ success: true, matches: rows || [] });
  });
});

// マッチIDからレコードを取得
router.post('/getRecordsByMatchId', requireAuth, (req, res) => {
  const { matchId } = req.body;

  if (!matchId) {
    res.json({ success: false, error: 'マッチIDが指定されていません' });
    return;
  }

  const query = 'SELECT * FROM record WHERE matchId = ? ORDER BY id';
  
  db.all(query, [matchId], (err, rows) => {
    if (err) {
      console.error(err);
      res.json({ success: false, error: 'サーバーエラー' });
      return;
    }

    res.json({ success: true, data: rows || [] });
  });
});

// マッチIDからマッチデータを取得
router.get('/getMatch', requireAuth, (req, res) => {
  const { id } = req.query;
  const userId = req.session.userId;

  if (!id) {
    res.json({ success: false, error: 'マッチIDが指定されていません' });
    return;
  }

  const query = 'SELECT * FROM match WHERE id = ? AND userId = ?';
  
  db.get(query, [id, userId], (err, row) => {
    if (err) {
      console.error(err);
      res.json({ success: false, error: 'サーバーエラー' });
      return;
    }

    if (!row) {
      res.json({ success: false, error: 'マッチが見つかりません' });
      return;
    }

    res.json(row);
  });
});

// 新規マッチを作成
router.post('/insertMatch', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const { date, team0, team1, players0, players1, gks0, gks1 } = req.body;

  if (!date || !team0 || !team1) {
    res.json({ success: false, error: '必要なパラメータが不足しています' });
    return;
  }

  const query = 'INSERT INTO match (userId, date, team0, team1, players0, players1, gks0, gks1) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.run(query, [userId, date, team0, team1, players0, players1, gks0, gks1], function(err) {
    if (err) {
      console.error(err);
      res.json({ success: false, error: 'マッチの作成に失敗しました' });
      return;
    }

    res.json({ success: true, matchId: this.lastID });
  });
});

// マッチを更新
router.put('/updateMatch', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const { id, date, team0, team1, players0, players1, gks0, gks1 } = req.body;

  if (!id || !date || !team0 || !team1) {
    res.json({ success: false, error: '必要なパラメータが不足しています' });
    return;
  }

  const query = 'UPDATE match SET date = ?, team0 = ?, team1 = ?, players0 = ?, players1 = ?, gks0 = ?, gks1 = ? WHERE id = ? AND userId = ?';
  
  db.run(query, [date, team0, team1, players0, players1, gks0, gks1, id, userId], function(err) {
    if (err) {
      console.error(err);
      res.json({ success: false, error: 'マッチの更新に失敗しました' });
      return;
    }

    if (this.changes === 0) {
      res.json({ success: false, error: 'マッチが見つかりません' });
      return;
    }

    res.json({ success: true, message: 'マッチを更新しました' });
  });
});

export default router;
