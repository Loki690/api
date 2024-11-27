import mongoose from "mongoose";

const receivedItemSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
    required: true,
  },
  requistioner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateReceived: {
    type: Date,
    required: true,
  },
  workOrderNo: {
    type: String,
    required: true,
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
        required: true,
      },
      qtyIn: {
        type: Number,
        required: true,
      },
    },
  ],
});

const ReceivedItem = mongoose.model("receivedItem", receivedItemSchema);

export default ReceivedItem;
