import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  name?: string;
  price: number;
  quantity: number;
  subtotal?: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId | string;
  items: ICartItem[];
  total: number;
  updatedAt: Date;
  createdAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
