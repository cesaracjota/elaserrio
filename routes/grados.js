/*
    Ruta: /api/grados
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    getGrado, 
    getGrados, 
    crearGrado,
    actualizarGrado, 
    eliminarGrado,
    getGradosBySede,
    getGradosByDocente,
} = require('../controllers/grados');

const { validarJWT, validarRoles } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getGrados);

router.get('/:id', [validarJWT], getGrado);

router.get('/sede/:id', [validarJWT], getGradosBySede);

router.get('/docente/:id', [validarJWT], getGradosByDocente);

router.post('/', [ 
    [validarJWT],
    validarRoles(["ADMIN_ROLE"]),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearGrado);

router.put('/:id', [
    [validarJWT],
    validarRoles(["ADMIN_ROLE"]),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarGrado);

// router.put('/inactivar/:id', validarJWT, inactivarCategoria);

// router.put('/activar/:id', validarJWT, activarCategoria);

router.delete('/:id', [
    [validarJWT],
    validarRoles(["ADMIN_ROLE"]),
    check('id', 'El id es obligatorio').not().isEmpty(),
    validarCampos,
], eliminarGrado);

module.exports = router;