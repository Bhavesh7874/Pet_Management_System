"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applicationController_1 = require("../controllers/applicationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router
    .route('/')
    .post(authMiddleware_1.protect, applicationController_1.createApplication)
    .get(authMiddleware_1.protect, authMiddleware_1.admin, applicationController_1.getApplications);
router.route('/my').get(authMiddleware_1.protect, applicationController_1.getMyApplications);
router.route('/:id/status').put(authMiddleware_1.protect, authMiddleware_1.admin, applicationController_1.updateApplicationStatus);
exports.default = router;
