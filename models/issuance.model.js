import mongoose from "mongoose";

const StockIssuanceListSchema = new mongoose.Schema({
  dateIssued: {
    type: String,
    required: true,
  },
  stockIssuanceNo: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: true,
  },
  projects: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subprojects",
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  requisitioner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  releasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  remarks: {
    type: String,
    required: true,
  },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        qtyOut: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }

);

const StockIssuanceList = mongoose.model(
  "StockIssuanceList",
  StockIssuanceListSchema
);
export default StockIssuanceList;
