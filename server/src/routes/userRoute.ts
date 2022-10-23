import {Router} from 'express';
import {signUpUser, loginUser} from '../controllers/userController';

const router = Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);

export default router;