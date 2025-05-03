/*
    Ruta: /api/pagos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    getEgresos,
    getEgreso,
    registrarEgreso,
    actualizarEgreso,
    eliminarEgreso,
    actualizarEstadoEgreso,
} = require('../controllers/egresos');

const { validarJWT} = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getEgresos);

router.get('/:id', getEgreso);

router.post('/', [
    validarJWT,
    check('monto', 'El monto del importe es obligatorio').not().isEmpty(),
    check('categoria', 'El categoria es obligatorio').not().isEmpty(),
    check('metodoPago', 'El metodo de pago es obligatorio').not().isEmpty(),
    validarCampos,
], registrarEgreso);

router.put('/:id', [
    validarJWT,
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarEgreso);

router.put('/estado/:id',
    validarJWT,
    actualizarEstadoEgreso
);

router.delete('/:id',
    [
        validarJWT,

        check('id', 'El id es obligatorio').not().isEmpty(),
        validarCampos,
    ], eliminarEgreso);

module.exports = router;