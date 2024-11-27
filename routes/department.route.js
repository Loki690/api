import express from "express";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAllDepartmentsByProjectId,
} from "../controllers/department.controller.js";

const router = express.Router();

router.post("/addDepartments/:projectId", createDepartment);
router.put("/putDepartments/:projectId/:departmentId", updateDepartment);
router.delete("/deleteDepartments/:projectId/:departmentId", deleteDepartment);
router.get("/getDepartments/project/:projectId", getAllDepartmentsByProjectId);

export default router;
