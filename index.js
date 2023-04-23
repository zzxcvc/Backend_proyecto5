const express = require('express') //instanciamos unservidor de express (libreria que funciona a traves de node.js)
const cors = require('cors');//* Cors nos permite hacer solicitudes entre dominios, ejemplo una peticion fetch a nuestro backend (nos permite conectar el backend con el frontend)
const userRouter = require('./Routes/userRoutes'); //importamos rutas
const productRouter = require('./Routes/productRoutes');

//Variables de entorno
require('dotenv').config(); 
require('./Config/database'); //conectamos la base de datos gracias a mongoAtlas a traves de moongose


const app = express(); //instanciamos el metodo express (libreria de node.js)

// const whiteList = ["https//localhost:3000"]
// esto va en cors{origin: whiteList}
//* middleware 

app.use(cors())
//* mi sevidor entienda json cuando se envie un body en thunder client
app.use(express.json())

//instanciamos los routes
app.use(userRouter)
app.use(productRouter)


const puerto = process.env.PORT; //conectamos el puerto que lo define la variable de entorno (.env)

//levantamos el servidor gracias al puerto
app.listen(puerto, () => console.log(`Conectado en puerto ${puerto}!`) )


//en index se encuentran todas las configuraciones del servidor.