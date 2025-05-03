// modulos routes

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  getModulos,
  getModulo,
  crearModulo,
  actualizarModulo,
  eliminarModulo,
} = require('../controllers/modulos');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getModulos);

router.get('/:id', [validarJWT], getModulo);

router.post('/', [
  validarJWT,
  check('name', 'El titulo es obligatorio').not().isEmpty(),
  validarCampos,
], crearModulo);

router.put('/:id', [
  validarJWT,
  validarCampos,
], actualizarModulo);

router.delete('/:id', [
  validarJWT,
], eliminarModulo);

module.exports = router;