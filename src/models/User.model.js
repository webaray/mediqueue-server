import mongoose from "mongoose";
import { USER_ROLE_VALUES, USER_ROLE } from "../constants/booking.constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,        
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    photoURL: {
      type: String,
      default: ""
    },
    firebaseUID: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USER_ROLE.STUDENT
    }
  },
  { timestamps: true }
);


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;