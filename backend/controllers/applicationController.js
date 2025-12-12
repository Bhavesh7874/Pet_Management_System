const Application = require('../models/applicationModel');
const Pet = require('../models/petModel');

// @desc    Submit adoption application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
    const { petId, message } = req.body;

    const pet = await Pet.findById(petId);

    if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.status !== 'available') {
        return res.status(400).json({ message: 'Pet is not available for adoption' });
    }

    // Check if user already applied for this pet
    const existingApplication = await Application.findOne({
        user: req.user._id,
        pet: petId,
    });

    if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this pet' });
    }

    const application = await Application.create({
        user: req.user._id,
        pet: petId,
        message,
    });

    res.status(201).json(application);
};

// @desc    Get logged in user applications
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res) => {
    const applications = await Application.find({ user: req.user._id }).populate(
        'pet',
        'name species images category price'
    );
    res.json(applications);
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
const getApplications = async (req, res) => {
    const applications = await Application.find({})
        .populate('user', 'name email')
        .populate('pet', 'name species category price');
    res.json(applications);
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
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
};

module.exports = {
    createApplication,
    getMyApplications,
    getApplications,
    updateApplicationStatus,
};
