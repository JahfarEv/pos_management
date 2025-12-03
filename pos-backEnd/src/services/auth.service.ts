import { User } from "../models/User";
import { IUser } from "../types/user";
import ApiError from "../utils/ApiError";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);


export const registerUser = async (
  name: string,
  mobile: string,
  password: string
): Promise<Omit<IUser, "password">> => {
  if (!name || !mobile || !password) {
    throw new ApiError(400, "Name, mobile and password are required");
  }

  const exists = await User.findOne({ mobile }).lean();
  if (exists) {
    throw new ApiError(400, "Mobile already registered");
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const created = await User.create({ name, mobile, password: hashed });

  const userObj = created.toObject() as Partial<IUser>;
  delete userObj.password;

  return userObj as Omit<IUser, "password">;
};




export const loginUser = async (
  mobile: string,
  password: string
): Promise<Omit<IUser, "password">> => {
  if (!mobile || !password) {
    throw new ApiError(400, "Mobile and password are required");
  }

  const user = await User.findOne({ mobile }).select("+password").lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const hashed = (user as any).password;
  const ok = await bcrypt.compare(password, hashed);

  if (!ok) {
    throw new ApiError(401, "Invalid credentials");
  }

  const safeUser = { ...user } as any;
  delete safeUser.password;

  return safeUser as Omit<IUser, "password">;
};
