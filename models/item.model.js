import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
    unique: true,
  },
  itemDescription: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  qtyIn: {
    type: Number,
    required: true,
    default: 0,
  },
  qtyOut: {
    type: Number,
    required: true,
    default: 0,
  },
  stockOnHand: {
    type: Number,
    required: true,
    default: 0,
  },
  toolLocator: {
    type: String,
    required: false,
  },
  remarks: {
    type: String,
    required: false,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
