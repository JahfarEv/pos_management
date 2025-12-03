import mongoose, { Model } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },
    password: {
      type: String,
      required: true, 
      select: false,  
    },
     username: {
    type: String,
    unique: true,
    sparse: true, // This allows null values in unique field
  },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
