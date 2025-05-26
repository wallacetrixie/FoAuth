import express from 'express';
import { registerValidation, loginValidation } from '../validators/validators.js';
import { registerUser, loginUser } from '../controllers/controller.js';

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

export default router;