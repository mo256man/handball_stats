import express from 'express';
import cors from 'cors';
import loginRouter from './routes/login';
import teamsRouter from './routes/teams';
import playersRouter from './routes/players';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', loginRouter);
app.use('/api', teamsRouter);
app.use('/api', playersRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
