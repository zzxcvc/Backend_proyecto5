
const User = require('../models/User'); //importa los schema de solo los usuarios.


const createUser = async(req, res) => {
    try {
        //* verificar email en uso
        const user = await User.findOne({ email: req.body.email })
        
        if(user){
            throw new Error('Email in use!!')
        } //si existe el usuario que me encontraste entonces le da un error

        //* Guardar info en nuestra base de datos
        const newUser = new User(req.body);
        newUser.hashPassword(req.body.password)

        await newUser.save() //* esperamos a que guarde en mongo atlas

        
        res.json({success: true, message: "User created successfully!", id: newUser._id, token: newUser.generateToken()})  //esperamos la respuesta

    } catch (error) {
        res.json({ success: false, message: error.message })
    }  
}

//* Admin functions
const getUsers = async(req, res) => {
    try {
        const users = await User.find().populate('favoriteProducts').select("-password");
        res.json({ success: true, users })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }   
}
//getUser para obtener la informacion de los usuarios, populamos el favoriteproducts, para que me muestre el objeto como tal a traves de un ID.

const deleteUser = async(req, res) => {
    try {
        console.log(req.params)
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);
        //esperamos a que encuentre el usuario con el ID para posteriormente eliminarlo.
        if(!result){
            throw new Error("Usuario no existe, imposible de eliminar!")
        }

        res.json({success: true, message: "Usuario Eliminado!!!"})


    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const editUser = async(req, res) => {
    //* obtengo id desde el token
    const { id } = req.auth
    //* Lo que envio en la solicitud
    const updateUser = req.body

    try {

        //* creamos una busqueda para validar que no exista un email ya creado o no sea el mismo

        const emails = await User.find()

        emails.forEach(user => {
            if(user.email === updateUser.email){
                throw new Error('Email en uso')
            }
        })
        
        const result = await User.findByIdAndUpdate(id, updateUser, {new: true}).select("-password -salt");
            
        console.log(result)
            
        if(!result){
            throw new Error("Usuario no existe, imposible de editar!")
        }

        
        // if(req.auth.email === result.email){
        //     throw new Error("Email en uso!!!")
        // }

        res.json({success: true, message: "Usuario editado con exito!!", info: result})

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

const getUserVerify = async(req, res) => {
    try {
        const { id } = req.auth;

        const user = await User.findById(id).populate('favoriteProducts').select("-password -salt");

        res.json({
            success: true,
            msg: `Informacion de: ${user.email}`,
            info: user
        })

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

const signIn = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
        if(!user){
            throw new Error('User not register!!')
        }

        const validate = user.hashValidation(password, user.salt, user.password) //todo proveniente de la base de datos, para verificar si la contraseña que ingreso el usuario es correcta

        if(!validate){
            throw new Error('Email o contraseña incorrecta!')
        }
       
        res.json({success: true, message: "Your account is login", token: user.generateToken()})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

module.exports = { createUser, getUsers, deleteUser, editUser, signIn, getUserVerify }