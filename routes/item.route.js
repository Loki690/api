import express from "express";
import {
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById,
  createFakeItem,
  createItemOnProject,
  importExcel,
  getAllItemsForAdmin,
  getAllItemsAdmin,
  getAllProjectItems,
  getAllItemsSelection,
} from "../controllers/item.controller.js"; // Use full path with '.js' extension
import multer from "multer";
import { verifyToken } from "../utils/verifyUser.js";
// Set up multer for file upload
const upload = multer({ dest: "uploads/" });

const router = express.Router();
// Create a new item
router.post("/add", createFakeItem);
// Get all items
//router.get('/items', getAllItems);
// Get all items within a specified project
router.get("/project/:id/getItems", verifyToken, getAllItems);
router.get("/project/:id/getItemsSelection", verifyToken, getAllItemsSelection);
router.post("/project/:id/import", upload.single("file"), importExcel);
// Get an item by ID within a specified project
router.get("/getItem/:itemId", getItemById);
// Create a new item on a specified project
router.post("/project/:id/add", createItemOnProject);
// Update an item by ID within a specified project
router.put("/project/:projectId/update/:itemId", updateItemById);
// Delete an item by ID within a specified project
router.delete("/project/:projectId/delete/:itemId", deleteItemById);

router.get("/items", getAllItemsForAdmin);

router.get("/items/getAll", getAllItemsAdmin);
router.get("/project/:id/getProjectItems", getAllProjectItems);
export default router;
