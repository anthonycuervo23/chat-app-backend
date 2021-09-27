const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response)=>{

    const {name, email, password} = req.body; 

    try {
        
        const emailExist = await User.findOne({email: email});
        if(emailExist){
            return res.status(400).json({
                ok: false,
                msg: 'email ya existe'
            });
        }

        const user = new User({name, email, password});

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
    
        await user.save();

        // Generar JWT
        const token = await generateJWT(user.id, user.name);

        
        res.json({
            ok: true,
            user,
            token

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal en el servidor'
        })
    }

}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        // Verificar si el email existe
        const user = await User.findOne({email: email});
        if (!user){
            return res.status(400).json({
                msg: 'Email no es valido'
            });
        }

        // verificar que el password sea correcto
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if(!isValidPassword){
            return res.status(400).json({
                msg: 'Contraseña es incorrecta'
            });
        }
        // Generar JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });
    
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        });

    }

}

const renewJWT = async( req, res = response ) => {

    const uid = req.uid;

    try {
        
        // Generar JWT
        const token = await generateJWT(uid);

        const user = await User.findById(uid);

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'algo salio mal en el servidor'
        });
        
    }
}

module.exports = {
    createUser,
    login,
    renewJWT
}