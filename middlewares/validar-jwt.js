const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
};

const validarRoles = (rolesPermitidos = []) => {
    return async (req, res, next) => {
        const uid = req.uid;

        try {
            const usuarioDB = await Usuario.findById(uid);

            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                });
            }

            if (!rolesPermitidos.includes(usuarioDB.rol)) {
                return res.status(403).json({
                    ok: false,
                    msg: 'No tiene privilegios para acceder a esta ruta o acción del sistema'
                });
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
    };
};

module.exports = {
    validarJWT,
    validarRoles
};