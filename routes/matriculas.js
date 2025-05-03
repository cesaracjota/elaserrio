/*
    Ruta: /api/matriculas
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getMatriculas,
  getMatricula,
  registrarMatricula,
  actualizarMatricula,
  actualizarPromediosYRanking,
  eliminarMatricula,
  searchStudent,
  getMatriculasByGrado,
  getEstudiantesByMateria,
} = require("../controllers/matricula");

const { validarJWT, validarRoles } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getMatriculas);
router.get("/grado/:gradoId", validarJWT, getMatriculasByGrado);
router.get("/materia/:materiaId", validarJWT, getEstudiantesByMateria);
router.get("/search/:search", validarJWT, searchStudent);
router.get("/:id", validarJWT, getMatricula);

router.post(
  "/",
  [
    validarJWT,
    validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
    validarCampos,
  ],
  registrarMatricula
);

router.put(
  "/:id",
  [
    validarJWT,
    validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
    check("id", "El id es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarMatricula
);

router.put(
  "/actualizarpromedioranking/:idGrado",
  [validarJWT, validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"])],
  actualizarPromediosYRanking
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
    check("id", "El id es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  eliminarMatricula
);

module.exports = router;
