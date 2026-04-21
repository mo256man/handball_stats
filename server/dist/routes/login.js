"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'ユーザー名とパスワードが必要です' });
        return;
    }
    const query = 'SELECT userName, password, teamId FROM user WHERE userName = ? AND password = ?';
    db_1.db.get(query, [username, password], (err, row) => {
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
        }
        else {
            res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
        }
    });
});
exports.default = router;
//# sourceMappingURL=login.js.map