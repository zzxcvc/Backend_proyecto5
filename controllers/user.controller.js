
const User = require('../models/User');


const createUser = async(req, res) => {
    try {
        //* verificar email en uso
        const user = await User.findOne({ email: req.body.email })
        
        if(user){
            throw new Error('Email in use!!')
        } 

        //* Guardar info en nuestra base de datos
        const newUser = new User(req.body);
        newUser.hashPassword(req.body.password)

        await newUser.save() //* guarda en mongo atlas

        
        res.json({success: true, message: "User created successfully!", id: newUser._id, token: newUser.generateToken()}) 

    } catch (error) {
        res.json({ success: false, message: error.message })
    }  
}

const getUsers = async(req, res) => {
    try {
        const users = await User.find().populate('favoriteProducts');
        res.json({ success: true, users })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }   
}

const deleteUser = async(req, res) => {
    try {
        console.log(req.params)
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);

        if(!result){
            throw new Error("Usuario no existe, imposible de eliminar!")
        }

        res.json({success: true, message: "Usuario Eliminado!!!"})


    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const editUser = async(req, res) => {
    try {
        const paramsId = req.params.id
        const authId = req.auth.id
        console.log(authId)
        const result = await User.findByIdAndUpdate(authId, req.body, {new: true});
            
        console.log(result)
            
        if(!result){
            throw new Error("Usuario no existe, imposible de editar!")
        }

        if(paramsId !== authId){
            throw new Error('No puedes editar, por que no eres el usuario de la cuenta!')
        }
        
        if(req.auth.email === result.email){
            throw new Error("Email en uso!!!")
        }

        res.json({success: true, message: "Usuario editado con exito!!"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const signIn = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
        if(!user){
            throw new Error('User not register!!')
        }

        const validate = user.hashValidation(password, user.salt, user.password)

        if(!validate){
            throw new Error('Email o contraseña incorrecta!')
        }
       
        res.json({success: true, message: "Your account is login", token: user.generateToken()})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

module.exports = { createUser, getUsers, deleteUser, editUser, signIn }