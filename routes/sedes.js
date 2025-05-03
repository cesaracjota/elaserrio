/*
    Ruta: /api/Sedes
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    getSede, 
    getSedes, 
    crearSede,
    actualizarSede, 
    eliminarSede,
} = require('../controllers/sedes');

const { validarJWT, validarRoles } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], validarRoles(["ADMIN_ROLE"]), getSedes);

router.get('/:id', getSede);

router.post('/', [ 
    [validarJWT],
    validarRoles(["ADMIN_ROLE"]),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearSede);

router.put('/:id', [
    [validarJWT],
    validarRoles(["ADMIN_ROLE"]),
    validarCampos,
], actualizarSede);

router.delete('/:id', [
    [validarJWT],
    validarRoles(["ADMIN_ROLE"]),
    check('id', 'El id es obligatorio').not().isEmpty(),
    validarCampos,
], eliminarSede);

module.exports = router;