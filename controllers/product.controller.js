const Product = require('../models/Product');//Llegan los Schema desde la carpeta models, tanto los schema productos como los schemas usuarios. pasamos el schema user para saber si el usuario esta conectado y si tiene el rol de administrador para poder crear editar o eliminar un producto. 
const User = require('../models/User'); 



//Publico

//tenemos una funcion que es async donde recibe una request (solicitud) y una response (recordar que: las solicitudes get, post, put... deben dar una respuesta). Envolvemos todo en un try y un catch, ya que si la solicitud ocurre con exito se devuelvo el codigo que esta señalado en el try, de lo contrario aparecera el mensaje realizado en el catch.
const getProducts = async(req, res) => {
    try {
        const products =  await Product.find()

        res.json({success: true, msg: "Lista de productos", info: products})
    } catch (error) {
       res.status(500).json({success: false, msg: "hubo un error en obteniendo los datos"}) 
    }
}

const getProductById = async(req,res) => {

    const { productId } = req.params

    try {
        const product = await Product.findById(productId);

        res.json({success: true, msg: "Producto obtenido", info: product})
    } catch (error) {
        res.status(500).json({success: false, msg: "hubo un error en obteniendo los datos"}) 
    }
}

//Admin



const createProduct = async(req, res) => {
    try {
        const user = await User.findById(req.auth.id)
        console.log(user.isAdmin)
        if(!user.isAdmin){
            throw new Error('No tienes acceso para crear productos!')
        }
        // tenemos una const que le llamamos user la cual esta esperando a que se encuentre la informacion con respecto al id del usuario (sacado en el schema) a traves del payload del token (auth para decodificarlo). si no es administrador entonces se le muestra el error.

        const newProduct = new Product(req.body);
        await newProduct.save();
        
        res.json({success: true, message: "Se ha creado un nuevo producto", productId: newProduct._id }) //si la persona es administrador, se crea el producto.
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}



const editProduct = async(req, res) => {

        const {name, price, brand, image, stock, color} = req.body;
        const {productId} = req.params;

    try {
        
        const edit = await Product.findByIdAndUpdate(productId, {name, price, brand, image, stock, color}, {new: true})
        
        res.json({success: true, msg: "Producto Actualizado!!!", update: edit})

    } catch (error) {
        res.status(500).json({success: false, msg: "hubo un error actualizando el producto"})
    }
}

const deleteProduct = async(req, res) => {

    const {productId} = req.params;

try {
    
    const destroyed = await Product.findByIdAndDelete(productId)
    
    res.json({success: true, msg: "Producto Elimiando!!!", delete: destroyed})

} catch (error) {
    res.status(500).json({success: false, msg: "hubo un error eliminando el producto"})
}
}


const reduceStock = async(req, res) => {
    const purchasedProducts = req.body.cartItems;
    try {
        purchasedProducts.map(async(purchasedProduct) => {
            await Product.findByIdAndUpdate(purchasedProduct._id, {stock: purchasedProduct.stock - purchasedProduct.quantity})
        })

        res.json({success: true, msg: 'stock reduced' })
    } catch (error) {
        res.status(500).json({success: false, msg: "hubo un error"})
    }
}

module.exports = {createProduct, editProduct, deleteProduct, getProductById, getProducts, reduceStock};