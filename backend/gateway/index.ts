import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Proxy Routes
app.use('/api/auth', createProxyMiddleware({ 
    target: 'http://localhost:5001', 
    changeOrigin: true 
}));

app.use('/api/pets', createProxyMiddleware({ 
    target: 'http://localhost:5002', 
    changeOrigin: true 
}));

app.use('/api/applications', createProxyMiddleware({ 
    target: 'http://localhost:5003', 
    changeOrigin: true 
}));

app.get('/', (req, res) => {
    res.send('API Gateway is running');
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
