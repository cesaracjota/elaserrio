/*
    Ruta: /api/usuarios
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getUsuarios,
  getUsuario,
  getAllDocentes,
  getAllDocentesTitulares,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  inactivarUsuario,
  activarUsuario,
} = require("../controllers/usuarios");

const { validarJWT, validarRoles } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", [validarJWT], validarRoles(["ADMIN_ROLE"]), getUsuarios);

router.get("/docentes/:id", [validarJWT], getAllDocentes);

router.get("/docente_titular/:id", [validarJWT], getAllDocentesTitulares);

router.get("/:id", [validarJWT], getUsuario);

router.post(
  "/",
  [
    validarJWT,
    validarRoles(["ADMIN_ROLE"]),
    check("nombre", "Los nombres y apellidos son obligatorios").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("correo", "El correo es obligatorio").isEmail(),
    validarCampos,
  ],
  crearUsuario
);

router.put(
  "/:id",
  [validarJWT, validarRoles(["ADMIN_ROLE"]), validarCampos],
  actualizarUsuario
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarRoles(["ADMIN_ROLE"]),
    check("id", "El id es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  eliminarUsuario
);

router.put(
  "/inactivar/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  inactivarUsuario
);

router.put(
  "/activar/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  activarUsuario
);

module.exports = router;
