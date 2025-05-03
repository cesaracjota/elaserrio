// cursos rutas

const { Router } = require("express");
const materiaController = require("../controllers/materias");
const { check } = require("express-validator");
const { validarJWT, validarRoles } = require("../middlewares/validar-jwt");

const router = Router();

router.get(
  "/",
  validarJWT,
  validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
  materiaController.getMaterias
);
router.get("/sede/:id", validarJWT, materiaController.getMateriasBySede);
router.get("/:id", validarJWT, materiaController.getMateria);
router.get("/docente/:id", validarJWT, materiaController.getMateriasByTeacher);
router.get("/grado/:id", validarJWT, materiaController.getMateriasByGrado);
router.post(
  "/",
  validarJWT,
  validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
  [check("nombre", "El nombre es obligatorio").not().isEmpty()],
  materiaController.crearMateria
);
router.put(
  "/:id",
  validarJWT,
  validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
  materiaController.actualizarMateria
);
router.delete(
  "/:id",
  validarJWT,
  validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
  materiaController.eliminarMateria
);

module.exports = router;
