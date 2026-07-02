import User from "../models/User.model.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, photoURL, firebaseUID } = req.body;

    if (!name || !email || !firebaseUID) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and firebaseUID are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
        data: existingUser
      });
    }

    const newUser = await User.create({ name, email, photoURL, firebaseUID });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
