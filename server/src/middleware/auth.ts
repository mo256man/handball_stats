import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const sess = req.session as any;
  if (!sess.userId) {
    res.status(401).json({ error: 'ログインが必要です' });
    return;
  }
  next();
};
