// roles routes

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roles');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getRoles);

router.get('/:id', [validarJWT], getRole);

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos,
], createRole);

router.put('/:id', [
  validarJWT,
  validarCampos,
], updateRole);

router.delete('/:id', [
  validarJWT,
], deleteRole);

module.exports = router;