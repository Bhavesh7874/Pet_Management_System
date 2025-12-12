"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const petController_1 = require("../controllers/petController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
router.route('/')
    .get(petController_1.getPets)
    .post(authMiddleware_1.protect, authMiddleware_1.admin, uploadMiddleware_1.default.single('image'), petController_1.createPet);
router.route('/:id')
    .get(petController_1.getPetById)
    .put(authMiddleware_1.protect, authMiddleware_1.admin, uploadMiddleware_1.default.single('image'), petController_1.updatePet)
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, petController_1.deletePet);
exports.default = router;
