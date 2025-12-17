import { Request, Response } from 'express';
import Application from '../models/applicationModel';
import Pet, { IPet } from '../models/petModel';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Submit adoption application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { petId, message } = req.body;

        const pet = await Pet.findById(petId);

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
        const existingApplication = await Application.findOne({
            user: req.user._id,
            pet: petId,
        });

        if (existingApplication) {
            res.status(400).json({ message: 'You have already applied for this pet' });
            return;
        }

        const application = await Application.create({
            user: req.user._id,
            pet: petId,
            message,
        });

        res.status(201).json(application);
    } catch (error) {
         if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

// @desc    Get logged in user applications
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
             res.status(401).json({ message: 'Not authorized' });
             return;
        }
        const applications = await Application.find({ user: req.user._id }).populate(
            'pet',
            'name species images category price'
        );
        res.json(applications);
    } catch (error) {
         if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
const getApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        const applications = await Application.find({})
            .populate('user', 'name email')
            .populate('pet', 'name species category price');
        res.json(applications);
    } catch (error) {
         if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }

        application.status = status;
        await application.save();

        // Optional: Auto-update pet status if approved
        if (status === 'approved') {
            const pet = await Pet.findById(application.pet);
            if (pet) {
                pet.status = 'adopted';
                if (pet.category === 'sale') {
                    pet.status = 'sold';
                }
                await pet.save();
            }
        }

        res.json(application);
    } catch (error) {
         if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};

export {
    createApplication,
    getMyApplications,
    getApplications,
    updateApplicationStatus,
};
