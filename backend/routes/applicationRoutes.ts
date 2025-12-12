import express from 'express';
import {
    createApplication,
    getMyApplications,
    getApplications,
    updateApplicationStatus,
} from '../controllers/applicationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router
    .route('/')
    .post(protect, createApplication)
    .get(protect, admin, getApplications);

router.route('/my').get(protect, getMyApplications);

router.route('/:id/status').put(protect, admin, updateApplicationStatus);

export default router;
