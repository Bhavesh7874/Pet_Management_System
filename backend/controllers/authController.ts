import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/userModel';
import { AuthRequest } from '../middleware/authMiddleware';

const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
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
                token: generateToken(user._id as unknown as string),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
        
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id as unknown as string),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
             res.status(401).json({ message: 'Not authorized' });
             return;
        }
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
             res.status(500).json({ message: 'Unknown error' });
        }
    }
};

export { registerUser, loginUser, getUserProfile };
