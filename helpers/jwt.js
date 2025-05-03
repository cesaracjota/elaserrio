const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                // expira en 7h por defecto
                expiresIn: '7h',
            },
            (err, token) => {
                if (err) {
                    console.error('Error al generar el JWT:', err);
                    reject(new Error('No se pudo generar el token'));
                } else {
                    resolve(token);
                }
            }
        );
    });
};

module.exports = {
    generarJWT
};