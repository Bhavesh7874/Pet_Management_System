"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const petRoutes_1 = __importDefault(require("./routes/petRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const seed_1 = __importDefault(require("./seed"));
dotenv_1.default.config();
(0, db_1.default)().then(async () => {
    await (0, seed_1.default)();
}).catch((err) => {
    console.error('Error in DB Connection or Seeding:', err);
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(authMiddleware_1.checkUser);
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/pets', petRoutes_1.default);
app.use('/api/applications', applicationRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
