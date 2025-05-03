/*
    Ruta: /api/estudiantes
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    getEstudiantes,
    getEstudiante, 
    registrarEstudiante, 
    actualizarEstudiante, 
    eliminarEstudiante,
    getEstudianteByDni,
    searchStudent,
    getEstudiantebyGrado,
} = require('../controllers/estudiantes');

const { validarJWT, validarRoles} = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]), getEstudiantes);

router.get('/buscar/estudiantes', validarJWT, searchStudent);

router.get('/:id', validarJWT, validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]), getEstudiante);

router.get('/dni/:dni', validarJWT, getEstudianteByDni);


router.get('/grado/:id', validarJWT, getEstudiantebyGrado);

router.post('/', [
    validarJWT,
    validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
    check('nombres', 'Los nombres son obligatorios').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('tipo_documento', 'El tipo de documento es obligatorio').not().isEmpty(),
    check('dni', 'El documento de identificacion es obligatorio').not().isEmpty(),
    check('sexo', 'El sexo es obligatorio').not().isEmpty(),
    validarCampos,
] , registrarEstudiante);

router.put('/:id',[
    validarJWT,
    validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
    check('nombres', 'Los nombres son obligatorios').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('dni', 'El dni son obligatorios').not().isEmpty(),
    validarCampos,
], actualizarEstudiante);

router.delete('/:id' ,
    [
        validarJWT,
        validarRoles(["ADMIN_ROLE", "DOCENTE_TITULAR_ROLE"]),
        check('id', 'El id es obligatorio').not().isEmpty(),
        validarCampos,
    ], eliminarEstudiante);

module.exports = router;