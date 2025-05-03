const express = require("express");
const router = express.Router();
const {
  upsertNota,
  obtenerNotas,
  actualizarRankingPorMateria,
  obtenerNotasPorMatriculayMateria,
  obtenerNotasPorMateria,
  obtenerNotasPorEstudiante,
  actualizarNota,
  eliminarNota,
} = require("../controllers/notas");
const { validarJWT } = require("../middlewares/validar-jwt");

// Rutas para la gestión de notas
router.put("/", validarJWT, upsertNota); // Crear una nota
router.get("/", obtenerNotas); // Obtener todas las notas
router.put("/ranking/:materiaId", validarJWT, actualizarRankingPorMateria); // Actualizar ranking por materia=
router.get("/estudiante/:matriculaId", validarJWT,  obtenerNotasPorEstudiante); // Obtener notas de un materia
router.get("/materia/:materiaId", validarJWT, obtenerNotasPorMateria); // Obtener notas de un curso
router.get("/:matriculaId/:materiaId", validarJWT, obtenerNotasPorMatriculayMateria); // Obtener notas de un estudiante
router.put("/:id", validarJWT, actualizarNota); // Actualizar nota y promedio
router.delete("/:id", validarJWT, eliminarNota); // Anular una nota

module.exports = router;