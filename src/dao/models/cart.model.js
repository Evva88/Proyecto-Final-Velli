import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema({
    id: Number,
    products:  [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
          },
          quantity: { type: Number, default: 0 }
        },
      ],
  
  });

cartSchema.pre("findOne", function () {
  this.populate("products.product");
});
cartSchema.plugin(mongoosePaginate);
export const cartModel = mongoose.model("carts", cartSchema);
