import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userCode: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'Head', 'Inventory', 'Crew'],
      required: true,
      default: 'Crew',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
