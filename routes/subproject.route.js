import express from "express";
import {
  createSubproject,
  updateSubproject,
  deleteSubproject,
  getAllSubprojectsByProjectId,
} from "../controllers/subproject.controller.js";

const router = express.Router();

router.post("/addSubprojects/:projectId", createSubproject);
router.put("/putSubprojects/:projectId/:subprojectId", updateSubproject);
router.delete("/deleteSubprojects/:projectId/:subprojectId", deleteSubproject);
router.get("/getSubprojects/project/:projectId", getAllSubprojectsByProjectId);

export default router;
