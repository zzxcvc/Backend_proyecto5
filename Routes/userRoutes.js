const express = require('express'); //instanciamos servidor express
const {createUser, getUsers, deleteUser, editUser, signIn, getUserVerify} = require('../controllers/user.controller'); //le pasamos los controladores que son funciones que colocamos en las solicitudes que le hacemos a estas rutas. (usercontrol)
const auth = require('../Middlewares/auth') //le pasamos un auth que viene desde middlewares que creamos de validacion para que sepa si hay token o no y pueda decodificar.
const userRouter = express.Router(); //instanciamos userRouter para que se comparte como una ruta de express


userRouter.route('/user') //usamos userRoute con el metodo route para señarlar un endpoint
    .post(createUser) //se crea usuario (createUser se almacena en la carpeta controles)
    .get(getUsers)//obtenemos la informacion 

userRouter.route('/user/:id') //eliminar usuario (ruta dinamica, respecto al id que llegue se podra eliminar el usuario deseado)
    .delete(deleteUser)
    
//se inicia sesion
userRouter.route('/user/signin')
    .post(signIn)
    
userRouter.route('/user/verify-user')
    .get(auth, getUserVerify) //verifica usuario

userRouter.route('/user/my-profile')
    .put(auth, editUser) //editar usuario

module.exports = userRouter;