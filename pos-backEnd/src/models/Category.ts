import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre("validate", function (next) {
  const cat = this as ICategory;
  if (cat.isModified("name") || !cat.slug) {
    cat.slug = slugify(cat.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model<ICategory>("Category", categorySchema);
