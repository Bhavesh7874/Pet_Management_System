import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import serverless from 'serverless-http';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
connectDB(); 

// Export for Serverless
export const handler = serverless(app);

// Local Development Support
if (process.env.IS_OFFLINE || process.env.NODE_ENV !== 'production') {
    const PORT = process.env.AUTH_PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Auth Service running on port ${PORT}`);
    });
}

