import express from 'express';
import {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
} from '../controllers/petController';
import { protect, admin } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
    .get(getPets)
    .post(protect, admin, upload.single('image'), createPet);

router.route('/:id')
    .get(getPetById)
    .put(protect, admin, upload.single('image'), updatePet)
    .delete(protect, admin, deletePet);

export default router;
