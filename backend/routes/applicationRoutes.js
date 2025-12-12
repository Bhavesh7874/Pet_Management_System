const express = require('express');
const router = express.Router();
const {
    createApplication,
    getMyApplications,
    getApplications,
    updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');

router
    .route('/')
    .post(protect, createApplication)
    .get(protect, admin, getApplications);

router.route('/my').get(protect, getMyApplications);

router.route('/:id/status').put(protect, admin, updateApplicationStatus);

module.exports = router;
