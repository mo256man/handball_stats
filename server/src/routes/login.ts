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

  const query = 'SELECT userId as id, userName, password, teamId FROM user WHERE userName = ? AND password = ?';
  db.get(query, [username, password], (err: Error | null, row: any | undefined) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'サーバーエラー' });
      return;
    }

    if (row) {
      // セッション作成
      const sess = req.session as any;
      sess.userId = row.id;
      sess.userName = row.userName;
      sess.teamId = row.teamId;
      
      req.session.save((err: Error | undefined) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'セッション作成エラー' });
          return;
        }
        
        res.json({
          userName: row.userName,
          password: row.password,
          teamId: row.teamId
        });
      });
    } else {
      res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
    }
  });
});

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err: Error | undefined) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'ログアウトエラー' });
      return;
    }
    res.json({ message: 'ログアウトしました' });
  });
});

export default router;
