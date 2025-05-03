/*
    Ruta: /api/reportes/ebr || /api/reportes/ceba || /api/reportes/residencia
*/

const { Router } = require('express');

const { 
    getAllReportMatriculas,
    getAllReportAdminBySede,
    getAllReportDocenteTitularBySede,
    getAllReportDocenteBySede,
} = require('../controllers/reportes');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getAllReportMatriculas);

router.get('/admin', [validarJWT], getAllReportAdminBySede);

router.get('/docente-titular', [validarJWT], getAllReportDocenteTitularBySede);

router.get('/docente', [validarJWT], getAllReportDocenteBySede);

module.exports = router;