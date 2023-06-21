import { Router } from "express"; 
import userController from "../controllers/user.controller";

const router = Router();


router.get('/', userController.getUsers)

router.post('/', userController.createUser)


router.route('/:id')
.get(userController.getUser)
.put(userController.updateUser)
.delete(userController.deleteUser)

export default router;