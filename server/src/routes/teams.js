import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/teams', requireAuth, (req, res) => {
  const onlyAvailable = req.query.onlyAvailable !== 'false'; // デフォルトは true
  
  let query = 'SELECT * FROM team';
  if (onlyAvailable) {
    query += ' WHERE isAvailable = 1';
  }
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'サーバーエラー' });
      return;
    }

    res.json(rows || []);
  });
});

export default router;
