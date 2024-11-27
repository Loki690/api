import Departments from "../models/department.js";

export const createDepartment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const departmentData = { ...req.body, project: projectId };
    const newDepartment = new Departments(departmentData);
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ message: "Failed to create department", error });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const updatedDepartment = await Departments.findByIdAndUpdate(
      { _id: req.params.departmentId },
      req.body,
      { new: true, runValidators: true } // returns the modified document
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: "Failed to update department", error });
  }
};

export const deleteDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const deletedDepartment = await Departments.findByIdAndDelete(departmentId);

    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete department", error });
  }
};

export const getAllDepartmentsByProjectId = async (req, res) => {
  const { projectId } = req.params;

  try {
    const departments = await Departments.find({ project: projectId });
    res.status(200).json(departments);
  } catch (error) {
    res.status(400).json({ message: "Failed to retrieve departments", error });
  }
};
