import Subprojects from "../models/subproject.model.js";

export const createSubproject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const subprojectData = { ...req.body, project: projectId };
    const newSubproject = new Subprojects(subprojectData);

    await newSubproject.save();
    res.status(201).json(newSubproject);
  } catch (error) {
    res.status(400).json({ message: "Failed to create subproject", error });
  }
};

export const updateSubproject = async (req, res) => {
  try {
    const updatedSubproject = await Subprojects.findByIdAndUpdate(
      { _id: req.params.subprojectId },
      req.body,
      { new: true, runValidators: true } // returns the modified document
    );

    if (!updatedSubproject) {
      return res.status(404).json({ message: "Subproject not found" });
    }

    res.status(200).json(updatedSubproject);
  } catch (error) {
    res.status(400).json({ message: "Failed to update subproject", error });
  }
};

export const deleteSubproject = async (req, res) => {
  const { subprojectId } = req.params;

  try {
    const deletedSubproject = await Subprojects.findByIdAndDelete(subprojectId);

    if (!deletedSubproject) {
      return res.status(404).json({ message: "Subproject not found" });
    }

    res.status(200).json({ message: "Subproject deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete subproject", error });
  }
};

export const getAllSubprojectsByProjectId = async (req, res) => {
  const { projectId } = req.params;

  try {
    const subprojects = await Subprojects.find({ project: projectId });
    res.status(200).json(subprojects);
  } catch (error) {
    res.status(400).json({ message: "Failed to retrieve subprojects", error });
  }
};
