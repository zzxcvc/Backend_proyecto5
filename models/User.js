const mongoose = require('mongoose'); //libreria
const crypto = require('crypto'); //libreria
const jwt = require('jsonwebtoken'); //libreria para generar el token que tiene una firma general (clave secreta)

//para lograr almacenar nuestros datos y que estos esten estructurados, usamos modelos:
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: "Nombre no señalado",
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        default: "Apellido no señalado",
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
        required: true
    },
    age: {
        type: Number,
        min: 16,
        max: 90
    },
    favoriteProducts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'product' 
        }
    ],
    password: {
        type: String,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/gm],
        required: true
    },
    salt: {
        type: String,
        required: true
    }, //agrega una palabra secreta y luego se encrypta
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
})
//aqui vienen los Metodos que lo ocuparemos con funciones que las podremos llamar en los controladores utilizando "hash".
userSchema.methods.hashPassword = function(password){
    this.salt = crypto.randomBytes(10).toString('hex')
    this.password = crypto.pbkdf2Sync(password, this.salt, 5000, 20, 'sha512').toString('hex')
} //aqui recibe la contraseña para ser encriptada. el this saca lo mismo que aparece en el esquema de mas arriba. (encrypta salt con los metodos randobytes [cuantos caracteres quieres q utilice la encryptacion] y tosTring).
//lo mismo pasa con password: encryptame la contaseña que le agregue un salt, que realice 5 mil repeticiones(cantidad de veces que se itera ), q tenga 20 caracteres y que este codificado a traves de "sha512". Luego transformalo en tostring en una cadena de texto con "hex" en su interior para que quede almacenado en el schema.

userSchema.methods.hashValidation = function(password, salt, passwordDB) {
    const hash = crypto.pbkdf2Sync(password, salt, 5000, 20, 'sha512').toString('hex');
    return hash === passwordDB;
} //luego hay que validar la password que ya esta almacenada y encryptada con la contraseña que el usuario esta escribiendo 

userSchema.methods.generateToken = function() {

    const payload = {
        id: this._id,
        email: this.email
    }
 //por ultimo tenemos otra funcion que genera un token cuando un usuario crea una cuenta o inicia sesion 
    const token = jwt.sign(payload, process.env.SECRET, {expiresIn: 360000});
    return token; //que nos devuelva el token con el secreto que le dimos en nuestra variable de entorno ("algo")
}


const User = mongoose.model('user', userSchema); //exportamos schema

module.exports = User;
