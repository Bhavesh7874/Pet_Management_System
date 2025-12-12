import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { checkUser } from './middleware/authMiddleware';
import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import applicationRoutes from './routes/applicationRoutes';
import { seedData } from './seed';

dotenv.config();

connectDB().then(async () => {
    await seedData();
}).catch((err) => {
    console.error('Error in DB Connection or Seeding:', err);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(checkUser);

app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/applications', applicationRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
