import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  mobile: string;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
  username?:string;
}
