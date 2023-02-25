const Product = require('../models/Product')

const createProduct = async(req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json({success: true, message: "Se ha creado un nuevo producto", productId: newProduct._id})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

module.exports = createProduct;