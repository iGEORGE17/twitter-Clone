import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

router.post('/login', authController.login)


router.post('/authenticate', authController.authenticateUer)







export default router;