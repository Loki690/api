import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  addProduct,
  deleteproduct,
  getproducts,
} from '../controllers/addproduct.controller.js';

const router = express.Router();

router.post('/add', verifyToken, addProduct); // test
router.get('/getproducts', getproducts);
router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteproduct);

export default router;
