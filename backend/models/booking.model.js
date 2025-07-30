import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
  {
    car: {
      type: ObjectId,
      ref: "Car",
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;
