import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

app.get('/', (req: Request, res: Response) => {
  res.send('API Sistem Pendaftaran Kegiatan Kampus is running...');
});

import authRoutes from './routes/auth.routes';
import kegiatanRoutes from './routes/kegiatan.routes';
import pesertaRoutes from './routes/peserta.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';

// Import Routes
app.use('/api/auth', authRoutes);
app.use('/api/kegiatan', kegiatanRoutes);
app.use('/api/peserta', pesertaRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
