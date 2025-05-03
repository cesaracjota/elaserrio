const express = require("express");
const router = express.Router();
const configuracionCtrl = require("../controllers/configuraciones");
const { validarJWT, validarRoles } = require("../middlewares/validar-jwt");

// GET - Obtener configuración
router.get("/", configuracionCtrl.obtenerConfiguracion);

// PUT - Actualizar configuración (una sola vez)
router.put("/", validarJWT, validarRoles(["ADMIN_ROLE"]),  configuracionCtrl.crearActualizarConfiguracion);

// DELETE - Eliminar configuración (opcional, si es necesario)
router.delete("/", validarJWT, validarRoles(["ADMIN_ROLE"]), configuracionCtrl.eliminarConfiguracion);

module.exports = router;
