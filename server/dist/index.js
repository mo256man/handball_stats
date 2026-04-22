"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connect_sqlite3_1 = __importDefault(require("connect-sqlite3"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const login_1 = __importDefault(require("./routes/login"));
const teams_1 = __importDefault(require("./routes/teams"));
const players_1 = __importDefault(require("./routes/players"));
const session = require('express-session');
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});
const port = 3000;
const SQLiteStore = (0, connect_sqlite3_1.default)(session);
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
const sessionStore = new SQLiteStore({
    db: 'sessions.db',
    dir: path_1.default.resolve('.')
});
app.use(session({
    store: sessionStore,
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use('/api', login_1.default);
app.use('/api', teams_1.default);
app.use('/api', players_1.default);
// Socket.IO イベントハンドリング
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map