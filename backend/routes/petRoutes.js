const express = require('express');
const router = express.Router();
const {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
} = require('../controllers/petController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getPets)
    .post(protect, admin, upload.single('image'), createPet);

router.route('/:id')
    .get(getPetById)
    .put(protect, admin, upload.single('image'), updatePet)
    .delete(protect, admin, deletePet);

module.exports = router;
