import express from 'express';
import {
  createUserWithProject,
  deleteUser,
  signout,
  test,
  updateUser,
  getAllProjectUsers,
  getUserbyId,
  getAllUsers,
  getSelf,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', deleteUser);
router.post('/signout', signout);
router.post('/createUserWithProject', createUserWithProject);

router.get('/projectUser/:id/getAll', getAllProjectUsers);

router.get('/projectUser/:id/getOne/:userId', getUserbyId);

router.get('/allUsers', getAllUsers);
router.get('/me', verifyToken, getSelf);

export default router;
