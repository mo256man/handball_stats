"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const requireAuth = (req, res, next) => {
    const sess = req.session;
    if (!sess.userId) {
        res.status(401).json({ error: 'ログインが必要です' });
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.js.map