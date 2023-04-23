const { expressjwt } = require('express-jwt');
require('dotenv').config();

//se genera un token 
const getToken = (req, res) => {
    
    const { authorization } = req.headers;

    if(authorization){
        const [type, token] = authorization.split(' ');
        return type === 'Bearer' ? token : null;
    }

    return null;
}


//En el siguiente codigo estamos decodificando el token, lo que obtenemos al decodificar vendria siendo la ID y el email que se encuentra en payload (models-user)
const auth = expressjwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: 'user',
    getToken
})

module.exports = auth;

//este middlewares es una validacion de token que sirve tanto para los controladores de productos y users.