import { Router, Request, Response } from 'express';
import { db } from '../db';
import type { ErrorResponse } from '../types/user';

const router = Router();

router.get('/players', (req: Request<{}, any[] | ErrorResponse, {}, { onlyAvailable?: string }>, res: Response<any[] | ErrorResponse>) => {
  const onlyAvailable = req.query.onlyAvailable !== 'false'; // デフォルトは true
  
  let query = 'SELECT * FROM players';
  if (onlyAvailable) {
    query += ' WHERE isAvailable = 1';
  }
  
  db.all(query, (err: Error | null, rows: any[]) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'サーバーエラー' });
      return;
    }

    res.json(rows);
  });
});

export default router;
