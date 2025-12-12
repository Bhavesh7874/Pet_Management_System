"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getApplications = exports.getMyApplications = exports.createApplication = void 0;
const applicationModel_1 = __importDefault(require("../models/applicationModel"));
const petModel_1 = __importDefault(require("../models/petModel"));
// @desc    Submit adoption application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
    try {
        const { petId, message } = req.body;
        const pet = await petModel_1.default.findById(petId);
        if (!pet) {
            res.status(404).json({ message: 'Pet not found' });
            return;
        }
        if (pet.status !== 'available') {
            res.status(400).json({ message: 'Pet is not available for adoption' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        // Check if user already applied for this pet
        const existingApplication = await applicationModel_1.default.findOne({
            user: req.user._id,
            pet: petId,
        });
        if (existingApplication) {
            res.status(400).json({ message: 'You have already applied for this pet' });
            return;
        }
        const application = await applicationModel_1.default.create({
            user: req.user._id,
            pet: petId,
            message,
        });
        res.status(201).json(application);
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
exports.createApplication = createApplication;
// @desc    Get logged in user applications
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const applications = await applicationModel_1.default.find({ user: req.user._id }).populate('pet', 'name species images category price');
        res.json(applications);
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
exports.getMyApplications = getMyApplications;
// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
const getApplications = async (req, res) => {
    try {
        const applications = await applicationModel_1.default.find({})
            .populate('user', 'name email')
            .populate('pet', 'name species category price');
        res.json(applications);
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
exports.getApplications = getApplications;
// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await applicationModel_1.default.findById(req.params.id);
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        application.status = status;
        await application.save();
        // Optional: Auto-update pet status if approved
        if (status === 'approved') {
            const pet = await petModel_1.default.findById(application.pet);
            if (pet) {
                pet.status = 'adopted';
                if (pet.category === 'sale') {
                    pet.status = 'sold';
                }
                await pet.save();
            }
        }
        res.json(application);
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
exports.updateApplicationStatus = updateApplicationStatus;
