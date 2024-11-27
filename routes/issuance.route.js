import express from "express";
import {
  createStockIssuance,
  updateStockIssuance,
  getAllStockIssuances,
  getStockIssuanceById,
  deleteStockIssuanceById,
  deleteItemFromStockIssuance,
  createStockIssuanceNo,
  getLastIssuance,
  getAllIssuedItemsForAdmin,
  getAllStockIssuancesSelection,
} from "../controllers/issuance.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/project/:projectId/create", createStockIssuance);
router.put("/project/:projectId/update/:issuanceId", updateStockIssuance);
router.get(
  "/project/:projectId/getAllIssuance",
  verifyToken,
  getAllStockIssuances
);
router.get(
  "/project/:projectId/getAllIssuanceSelection",
  verifyToken,
  getAllStockIssuancesSelection
);
router.get(
  "/project/:projectId/getIssuanceById/:issuanceId",
  getStockIssuanceById
);
router.delete(
  "/project/:projectId/deleteIssuance/:issuanceId",
  deleteStockIssuanceById
);
router.delete(
  "/project/:projectId/issuance/:issuanceId/items/:itemId",
  deleteItemFromStockIssuance
);

router.post("/project/:projectId/createIssuanceNo", createStockIssuanceNo);
router.get("/project/:projectId/getLastIssuance", getLastIssuance);
router.get("/issuedList", getAllIssuedItemsForAdmin);
export default router;
