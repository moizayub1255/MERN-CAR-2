//function to check Avilability of car for a given Data

import bookingModel from "../models/booking.model.js";
import CarModel from "../models/car.model.js";

const checkAvailability = async (car, pickupDate, returnDate) => {
  const bookings = await bookingModel.find({
    car,
    pickupDate: { $lte: returnDate }, //lessthan
    returnDate: { $gte: pickupDate }, //gretherthan
  });
  return bookings.length === 0;
};

//API to check Avilability of cars for the given Date and location

export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;
    //fetch all available car for the given location
    const cars = await CarModel.find({ location, isAvailable: true });

    // check car availability for the given date range using promise

    const AvailabilityOfCarPromise = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isAvailable: isAvailable };
    });
    let availableCars = await Promise.all(AvailabilityOfCarPromise);
    availableCars = availableCars.filter(car => car.isAvailable === true);
    res.json({success:true,availableCars})
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to create booking 
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { pickupDate, returnDate, car } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "car is not avilable" });
    }
    const carData = await CarModel.findById(car);

    //Calculate price based on the picup Date and return Date
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;
    await bookingModel.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });
    res.json({ success: true, message: "Booking created" });
  } catch (error) {
    console.log(error.message)
    res.json({success:false,message:error.message})
  }
};

//API to list user booking
export const getUserBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await bookingModel
      .find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to get Owner Booking

export const getOwnerBooking = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauhorized" });
    }
    const bookings = await bookingModel
      .find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to change booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;
    const booking = await bookingModel.findById(bookingId);
    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    booking.status = status;
    await booking.save();

    res.json({ success: true, message: " status updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
