const mongoose = require("mongoose");
//Schema del producto:
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    }
  },
  {
    //* fecha de creacion y actualizacion del producto
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema); //exportamos los schemas productos los cuales llegaran a los controladores de producto.

module.exports = Product;
