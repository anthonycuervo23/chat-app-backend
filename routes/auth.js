/*
    path: api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renewJWT } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'Contraseña es obligatoria').not().isEmpty(),
    check('email', 'Email no valido').isEmail(),
    validateFields
] ,createUser);

router.post('/', [
    check('password', 'Contraseña es obligatoria').not().isEmpty(),
    check('email', 'Email no valido').isEmail(),
    validateFields
], login);

router.get('/renew', validateJWT, renewJWT)

module.exports = router;