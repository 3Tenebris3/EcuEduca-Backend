import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes';
//import { userRouter } from './routes/user.router';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRouter);
//app.use('/users', userRouter);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
