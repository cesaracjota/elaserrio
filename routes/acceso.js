// roles routes

const { Router } = require('express');

const {
    getAccesos,
    deleteAcceso,
} = require('../controllers/accesos');

const { validarJWT, validarRoles } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getAccesos);

router.delete('/:id', [
  validarJWT,
  validarRoles(["ADMIN_ROLE"]),
], deleteAcceso);

module.exports = router;