const mongoose = require('mongoose') //configuracion de mi base de datos, permite conectar mongoAtlas con mongoose (libreria de Node.js)


mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB).then(() => console.log('Base de datos conectada con exito!!!')) //(aqui se conecta moongose)