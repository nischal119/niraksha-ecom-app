import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
    unique: true,
  },

  slug: {
    type: String,
    lowercase: true,
  },
});
export default mongoose.model("CategoryModel", categorySchema);
