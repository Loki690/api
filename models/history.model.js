import mongoose from "mongoose";

const Schema = mongoose.Schema;

const historySchema = new Schema({

    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    action: {
        type: String,
        enum: ['created', 'updated', 'deleted', 'received', 'issued'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    changes: {
        type: String,
        default: {}
    },
    stockIssuanceNo: { 
        type: String,
        required: false
     },
    qtyIssue: {
        type: Number,
        required: false
    },
    qtyReceived: {
        type: Number,
        required: false
    },
    workOrderNo: { 
        type: String,
        required: false
     }

});

const History = mongoose.model("History", historySchema);
export default History;
