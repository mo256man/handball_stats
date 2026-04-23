import express from 'express';
import cors from 'cors';
import ConnectSqliteStore from 'connect-sqlite3';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import loginRouter from './routes/login.js';
import teamsRouter from './routes/teams.js';
import playersRouter from './routes/players.js';
import { fileURLToPath } from 'url';
import session from 'express-session';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

const port = 3000;
const SQLiteStore = ConnectSqliteStore(session);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const sessionStore = new SQLiteStore({
  db: 'sessions.db',
  dir: path.resolve('.')
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

app.use('/api', loginRouter);
app.use('/api', teamsRouter);
app.use('/api', playersRouter);

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
