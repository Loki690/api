import express from 'express';
import { getHistory, getHistoryById, getItemHistory } from '../controllers/history.controller.js';
const router = express.Router();

router.get('/getAll', getHistory);
router.get('/get/:id', getHistoryById);
router.get('/get/item/:itemId', getItemHistory);

export default router;