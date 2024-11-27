import express from "express";
import {
  createReceivedItem,
  updateReceivedItem,
  getAllReceivedItems,
  getReceivedItemById,
  deleteReceivedItemById,
  getAllReceivedItemsForAdmin,
  getAllReceivedItemsSelection,
} from "../controllers/receivedItem.controller.js"; // Import controller functions]
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// POST: Create a received item
router.post("/project/:projectId", createReceivedItem);

// PUT: Update a received item
router.put("/project/:projectId/:itemId", updateReceivedItem);

// GET: Get all received items for a project
router.get(
  "/project/allReceivedItem/:projectId",
  verifyToken,
  getAllReceivedItems
);
router.get(
  "/project/allReceivedItemSelection/:projectId",
  verifyToken,
  getAllReceivedItemsSelection
);

// GET: Get a specific received item by ID
router.get("/project/:projectId/receivedItem/:itemId", getReceivedItemById);

// DELETE: Delete a received item by ID
router.delete(
  "/project/:projectId/deleteReceivedItem/:itemId",
  deleteReceivedItemById
);

router.get("/receivedList", getAllReceivedItemsForAdmin);
export default router;
