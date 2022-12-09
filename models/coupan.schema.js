import mongoose from "mongoose";

const coupanSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "please provide a coupan name"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", coupanSchema);
