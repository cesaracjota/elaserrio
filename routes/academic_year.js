const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getAcademicsYear,
  getAcademicYear,
  getActiveAcademicsYear,
  registerAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require("../controllers/academic_year");

const { validarJWT, validarRoles } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", [validarJWT], getAcademicsYear);
router.get("/active", [validarJWT], getActiveAcademicsYear);
router.get("/:id", getAcademicYear);


router.post(
  "/",
  [
    validarJWT,
    validarRoles(["ADMIN_ROLE"]),
    check("year", "El año es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  registerAcademicYear
);

router.put(
  "/:id",
  [
    validarJWT,
    validarRoles(["ADMIN_ROLE"]),
    check("year", "El año es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  updateAcademicYear
);

router.delete(
  "/:id",
  [
    validarJWT,
    validarRoles(["ADMIN_ROLE"]),
    check("id", "El id es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  deleteAcademicYear
);

module.exports = router;
