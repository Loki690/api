import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
    unique: true,
  },
  itemDescription: {
    type: String,
    required: false,
  },
  unit: {
    type: String,
    required: false,
  },
  qtyIn: {
    type: Number,
    required: false,
    default: 0,
  },
  qtyOut: {
    type: Number,
    required: false,
    default: 0,
  },
  stockOnHand: {
    type: Number,
    required: false,
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
    ref: 'Project',
    required: false,
  },
});

export default itemSchema;
