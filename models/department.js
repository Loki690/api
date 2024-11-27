import mongoose, { Schema } from "mongoose";

const departmentList = new Schema({
  departmentName: {
    type: String,
    required: true,
  },
  departmentDescription: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});
const Departments = mongoose.model("Departments", departmentList);
export default Departments;
