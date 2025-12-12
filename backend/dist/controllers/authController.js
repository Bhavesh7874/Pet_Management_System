"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await userModel_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = await userModel_1.default.create({
            name,
            email,
            password,
            role: role || 'user', // Default to user if not specified
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};
exports.loginUser = loginUser;
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = await userModel_1.default.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};
exports.getUserProfile = getUserProfile;
