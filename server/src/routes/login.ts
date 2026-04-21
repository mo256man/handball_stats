import { Router, Request, Response } from 'express';
import { db } from '../db';
import { LoginRequest, LoginResponse, ErrorResponse, User } from '../types/user';

const router = Router();

router.post('/login', (req: Request<{}, LoginResponse | ErrorResponse, LoginRequest>, res: Response<LoginResponse | ErrorResponse>) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'ユーザー名とパスワードが必要です' });
    return;
  }

  const query = 'SELECT userName, password, teamId FROM user WHERE userName = ? AND password = ?';
  db.get(query, [username, password], (err: Error | null, row: User | undefined) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'サーバーエラー' });
      return;
    }

    if (row) {
      res.json({
        userName: row.userName,
        password: row.password,
        teamId: row.teamId
      });
    } else {
      res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
    }
  });
});

export default router;
