/*
    Ruta: /api/tipo_activo
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getConceptosPago, getConceptoPago, registrarConceptoPago, actualizarConceptoPago, eliminarConceptoPago } = require('../controllers/concepto_pago');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getConceptosPago);

router.get('/:id', getConceptoPago);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], registrarConceptoPago);

// Actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarConceptoPago);

router.delete('/:id', [
    validarJWT,
    check('id', 'El id es obligatorio').isMongoId(),
    validarCampos,
], eliminarConceptoPago);

module.exports = router;