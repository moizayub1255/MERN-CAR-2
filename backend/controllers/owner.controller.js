// import { format, isAbsolute } from "path";
import imagekit from "../configs/imageKit.js";
import UserModel from "../models/user.model.js";
import fs from "fs";
import CarModel from "../models/car.model.js";
import bookingModel from "../models/booking.model.js";
// import { create } from "domain";

export const changeRoleToOwner = async (req, res) => {
  // console.log("Function reached"); // test if function runs
  try {
    const { _id } = req.user;
    console.log("changeRoleToOwner function triggered");
    // console.log(req.user)
    // console.log(_id)
    await UserModel.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list the car" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to list car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    //upload image to imageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    //optimization through imagekit URL tranformation
    // For URL Generation, works for both images and videos
    let optimizedUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });
    const image = optimizedUrl;
    await CarModel.create({ ...car, owner: _id, image });
    res.json({ success: true, message: "car added" });
  } catch (error) {}
};

//API  to list owner car
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await CarModel.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to toggle car avilability
export const toggleCarAvailability = async (req, res) => {
  try {
    const {_id} = req.user;
    const {carId} = req.body;
    const car = await CarModel.findById(carId);

    if (car.owner.toString() !== _id.toString()) {
      return json({ success: false, message: "Unauthorized" });
    }
    car.isAvailable = !car.isAvailable; 
    await car.save();
    res.json({ success: true, message: "Avilability toggle" });
  } catch (error) {
    console.log(error.message);
    json({ success: false, message: error.message });
  }
};

//API to Delete car avilability
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await CarModel.findById(carId);

    if (car.owner.toString() !== _id.toString()) {
      return json({ success: false, message: "Unauthorized" });
    }
    car.owner = null;
    car.isAvailable = false;

    await car.save();
    res.json({ success: true, message: "car removed" });
  } catch (error) {
    console.log(error.message);
    json({ success: false, message: error.message });
  }
};

//APi to get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const cars = await CarModel.find({ owner: _id });
    const bookings = await bookingModel
      .find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await bookingModel.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await bookingModel.find({
      owner: _id,
      status: "confirmed",
    });

    //calculate monthly revenue from booking where status is confirmed
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      recentBookings: bookings.slice(0, 3),
      // confirmedBooking: confirmedBooking.length,
      completedBookings: completedBookings.length,
      monthlyRevenue,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to update user image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;
    //upload image to imageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });
    //optimization through imageKit URL transformation
    let optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });
    const image = optimizedImageUrl;
    await UserModel.findByIdAndUpdate(_id, { image });
    res.json({ success: true, message: "profile updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
