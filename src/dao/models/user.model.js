import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {type: mongoose.Schema.Types.ObjectId, ref:"carts"},
  role: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  documents: [{
    name:{
      type: String,
      unique: true,
    },
    reference: String,
    status: {
      type: String,
      default: "Pending",
    },
  }],
  last_connection: Date,
});

export const userModel = mongoose.model("users", userSchema);


