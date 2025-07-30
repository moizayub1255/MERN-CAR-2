import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import carModel from "../models/car.model.js"

const generateToken = (userId) => {
  const payload = userId;
  return jwt.sign(payload, process.env.JWT_SECRET);
};

//Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.json({
        success: "false",
        message: "Fill all the fields correctly",
      });
    }
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.json({ success: "false", message: "user alredy exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name: name,
      email: email,
      password: hashPassword,
    });

    await user.save().then(() => {
      console.log("User saved successfully");
    }).catch((err) => {
      console.error("Error saving user:", err);
    });

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: "false", message: error.message });
  }
};

// login user

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: "false", message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: "false", message: "Invalid Credential" });
    }
    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: "false", message: error.message });
  }
};

//Get user data using JWT token
export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: "false", message: error.message });
  }
};

//Get all car for the frontend
export const getCars=async(req,res)=>{
  try {
    const cars=await carModel.find({isAvailable:true})
    res.json({success:true,cars})
  } catch (error) {
    console.log(error.message)
    res.json({success:false,message:error.message})
  }
}