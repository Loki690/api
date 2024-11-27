import mongoose, { Schema } from "mongoose";

const subProjectList = new Schema({
  subprojectName: {
    type: String,
    required: true,
  },
  subprojectDescription: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});

const Subprojects = mongoose.model("Subprojects", subProjectList);
export default Subprojects;
