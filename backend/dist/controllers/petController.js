"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePet = exports.updatePet = exports.createPet = exports.getPetById = exports.getPets = void 0;
const petModel_1 = __importDefault(require("../models/petModel"));
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
        if (req.query.category)
            keyword.category = req.query.category;
        if (req.query.species)
            keyword.species = { $regex: req.query.species, $options: 'i' };
        if (req.query.breed)
            keyword.breed = { $regex: req.query.breed, $options: 'i' };
        if (req.query.status)
            keyword.status = req.query.status;
        const count = await petModel_1.default.countDocuments({ ...keyword });
        const pets = await petModel_1.default.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({ pets, page, pages: Math.ceil(count / pageSize) });
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
exports.getPets = getPets;
// @desc    Fetch single pet
// @route   GET /api/pets/:id
// @access  Public
const getPetById = async (req, res) => {
    try {
        const pet = await petModel_1.default.findById(req.params.id);
        if (pet) {
            res.json(pet);
        }
        else {
            res.status(404).json({ message: 'Pet not found' });
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
exports.getPetById = getPetById;
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
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const pet = await petModel_1.default.create({
            name,
            species,
            breed,
            age,
            description,
            images, // Store Base64 string
            category,
            price,
        });
        res.status(201).json(pet);
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
exports.createPet = createPet;
// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
const updatePet = async (req, res) => {
    try {
        const { name, species, breed, age, description, status, category, price } = req.body;
        const pet = await petModel_1.default.findById(req.params.id);
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
        }
        else {
            res.status(404).json({ message: 'Pet not found' });
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
exports.updatePet = updatePet;
// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private/Admin
const deletePet = async (req, res) => {
    try {
        const pet = await petModel_1.default.findById(req.params.id);
        if (pet) {
            await pet.deleteOne();
            res.json({ message: 'Pet removed' });
        }
        else {
            res.status(404).json({ message: 'Pet not found' });
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
exports.deletePet = deletePet;
