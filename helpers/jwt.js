const jwt = require('jsonwebtoken');

const generateJWT = (uid, name) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid, name };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '48h'
        }, (err, token) => {
            
            if (err){
                // no se pudo generar el JWT
                console.log(err);
                reject('No se pudo generar el JWT');
            } else{
                // JWT Generado
                resolve(token);
            }
        });

    });

};

const validateJWT = (token = '') => {
    
    try {
        
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        
        return [true, uid];

    } catch (error) {
        return [false, null];
    }
}

module.exports = {
    generateJWT,
    validateJWT
}