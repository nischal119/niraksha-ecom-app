import mongoose from "mongoose";

const orderShema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},

    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not processed",
      enum: ["Not processed", "Completed", "Cancelled", "Shipped", "Delivered"],
    },
  },
  { timestamps: true }
);
export default mongoose.model("Order", orderShema);
