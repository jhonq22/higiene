import { Router } from "express";
const userController = require('../controllers/user.controller');

const router = Router();

router.post('/register', userController.register);

export default router;
