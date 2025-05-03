/*
    Ruta: /api/pagos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    getTramites,
    getTramite,
    registrarTramite,
    actualizarTramite,
    eliminarTramite,
    actualizarEstadoTramite,
} = require('../controllers/tramites');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getTramites);

router.get('/:id', getTramite);

router.post('/', [
    validarJWT,
    check('tipoTramite', 'El tipo de tramite es obligatorio').not().isEmpty(),
    check('solicitante', 'El solicitante es obligatorio').not().isEmpty(),
    check('responsable', 'El responsable es obligatorios').not().isEmpty(),
    validarCampos,
], registrarTramite);

router.put('/:id', [
    validarJWT,
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('tipoTramite', 'El tipo de tramite es obligatorio').not().isEmpty(),
    check('solicitante', 'El solicitante es obligatorio').not().isEmpty(),
    check('responsable', 'El responsable es obligatorios').not().isEmpty(),
    validarCampos,
], actualizarTramite);

router.put('/estado/:id',
    validarJWT,
    actualizarEstadoTramite
);

router.delete('/:id',
    [
        validarJWT,
        check('id', 'El id es obligatorio').not().isEmpty(),
        validarCampos,
    ], eliminarTramite);

module.exports = router;