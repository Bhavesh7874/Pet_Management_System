const Pet = require('../models/petModel');

// @desc    Fetch all pets
// @route   GET /api/pets
// @access  Public
// @desc    Fetch all pets
// @route   GET /api/pets
// @access  Public
const getPets = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = {};

        if (req.query.keyword) {
            keyword.name = { $regex: req.query.keyword, $options: 'i' };
        }
        if (req.query.category) keyword.category = req.query.category;
        if (req.query.species) keyword.species = { $regex: req.query.species, $options: 'i' };
        if (req.query.breed) keyword.breed = { $regex: req.query.breed, $options: 'i' };
        if (req.query.status) keyword.status = req.query.status;

        const count = await Pet.countDocuments({ ...keyword });
        const pets = await Pet.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ pets, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single pet
// @route   GET /api/pets/:id
// @access  Public
const getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (pet) {
            res.json(pet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a pet
// @route   POST /api/pets
// @access  Private/Admin
const createPet = async (req, res) => {
    try {
        const { name, species, breed, age, description, category, price } = req.body;
        let images = [];

        if (req.file) {
            // Convert buffer to Base64
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            images.push(dataURI);
        }

        const pet = await Pet.create({
            name,
            species,
            breed,
            age,
            description,
            images, // Store Base64 string
            category,
            price,
            user: req.user._id,
        });
        res.status(201).json(pet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
const updatePet = async (req, res) => {
    try {
        const { name, species, breed, age, description, status, category, price } = req.body;

        const pet = await Pet.findById(req.params.id);

        if (pet) {
            pet.name = name || pet.name;
            pet.species = species || pet.species;
            pet.breed = breed || pet.breed;
            pet.age = age || pet.age;
            pet.description = description || pet.description;
            pet.category = category || pet.category;
            pet.price = price !== undefined ? price : pet.price;
            pet.status = status || pet.status;

            if (req.file) {
                const b64 = Buffer.from(req.file.buffer).toString('base64');
                const dataURI = `data:${req.file.mimetype};base64,${b64}`;
                pet.images = [dataURI]; // Replace existing image
            }

            const updatedPet = await pet.save();
            res.json(updatedPet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private/Admin
const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (pet) {
            await pet.deleteOne();
            res.json({ message: 'Pet removed' });
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
};
