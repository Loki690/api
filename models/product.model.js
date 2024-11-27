import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      default: '',
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productQty: {
      type: Number,
      required: true,
    },
    productCategory: {
      type: String,
      default: 'uncategorized',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      //required: true,
    },
  },
  { timestamps: true }
);

const Add = mongoose.model('Product', postSchema);

export default Add;
