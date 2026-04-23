export const requireAuth = (req, res, next) => {
  const sess = req.session;
  if (!sess.userId) {
    res.status(401).json({ error: 'ログインが必要です' });
    return;
  }
  next();
};
