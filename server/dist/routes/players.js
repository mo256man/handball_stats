"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/players', (req, res) => {
    const onlyAvailable = req.query.onlyAvailable !== 'false'; // デフォルトは true
    let query = 'SELECT * FROM players';
    if (onlyAvailable) {
        query += ' WHERE isAvailable = 1';
    }
    db_1.db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'サーバーエラー' });
            return;
        }
        res.json(rows);
    });
});
exports.default = router;
//# sourceMappingURL=players.js.map