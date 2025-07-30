import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityOfCar,
  createBooking,
  getOwnerBooking,
  getUserBooking,
} from "../controllers/booking.controller.js";
import {protect} from "../middlewares/auth.middleware.js";
const bookingRoute = express.Router();

bookingRoute.post("/check-avialability", checkAvailabilityOfCar);
bookingRoute.post("/create", protect, createBooking);
bookingRoute.get("/user", protect, getUserBooking);
bookingRoute.get("/owner", protect, getOwnerBooking);
bookingRoute.post("/change-status", protect, changeBookingStatus);

export default bookingRoute;
