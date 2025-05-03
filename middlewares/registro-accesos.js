const Acceso = require("../models/acceso");
const Usuario = require("../models/usuario");
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

/**
 * Middleware para registrar accesos de usuario al sistema
 * Incluye detección de IP, ubicación geográfica y dispositivo mejorado
 */
const registrarAcceso = async (req, res, next) => {
  const { correo } = req.body;

  try {
    // Obtener la IP real del cliente usando request-ip
    const clientIp = requestIp.getClientIp(req) || 'IP no disponible';
    
    // Obtener información geográfica de la IP
    const geo = geoip.lookup(clientIp);
    
    // Obtener información del usuario si existe
    const usuario = await Usuario.findOne({ correo });

    if (usuario) {
      // Preparar datos de ubicación si están disponibles
      const ubicacionData = geo ? {
        pais: geo.country,
        region: geo.region,
        ciudad: geo.city,
        coordenadas: geo.ll, // [latitud, longitud]
        timezone: geo.timezone
      } : {
        pais: 'Desconocido',
        region: 'Desconocido',
        ciudad: 'Desconocido',
        coordenadas: [0, 0],
        timezone: 'Desconocido'
      };

      // Obtener información del dispositivo más estructurada
      const infoDispositivo = obtenerInfoDispositivo(req.get("User-Agent"));

      // Crear registro de acceso con información adicional
      await Acceso.create({
        usuario: usuario._id,
        ruta: req.originalUrl,
        metodo: req.method,
        ip: clientIp,
        ubicacion: ubicacionData,
        userAgent: req.get("User-Agent"),
        fechaHora: new Date(),
        estadoRespuesta: res.statusCode,
        referer: req.get('Referer') || '',
        dispositivo: {
          tipo: infoDispositivo.tipo,
          navegador: infoDispositivo.navegador,
          sistema: infoDispositivo.sistema
        },
        sesionId: req.sessionID || null,
        query: JSON.stringify(req.query),
        tipoContenido: req.get('Content-Type') || ''
      });
      
      // Opcional: Añadir usuario al objeto request para uso posterior
      req.usuarioId = usuario._id;
    }
  } catch (error) {
    // Mejorar el registro de errores con más detalles
    console.error(`Error registrando acceso [${req.method} ${req.originalUrl}]:`, {
      error: error.message,
      stack: error.stack,
      correo: correo || 'no proporcionado'
    });
    
    // Continuar la ejecución incluso si hay un error en el registro
  }

  next();
};

/**
 * Función auxiliar para extraer información del dispositivo desde User-Agent
 * @returns {Object} Objeto con propiedades tipo, navegador y sistema
 */
function obtenerInfoDispositivo(userAgent) {
  if (!userAgent) {
    return {
      tipo: 'desconocido',
      navegador: 'desconocido',
      sistema: 'desconocido'
    };
  }
  
  const ua = userAgent.toLowerCase();
  
  // Detectar tipo de dispositivo (móvil/desktop)
  let tipo = 'desktop';
  if (/mobile|android|iphone|ipod|webos|iemobile|opera mini/i.test(ua)) {
    tipo = 'mobile';
  } else if (/ipad|tablet|playbook|silk/i.test(ua)) {
    tipo = 'tablet';
  }
  
  // Detectar navegador
  let navegador = 'otro';
  if (ua.includes('chrome') && !ua.includes('edg')) {
    navegador = 'chrome';
  } else if (ua.includes('firefox')) {
    navegador = 'firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    navegador = 'safari';
  } else if (ua.includes('edg')) {
    navegador = 'edge';
  } else if (ua.includes('opera') || ua.includes('opr')) {
    navegador = 'opera';
  } else if (ua.includes('msie') || ua.includes('trident/')) {
    navegador = 'ie';
  }
  
  // Detectar sistema operativo
  let sistema = 'otro';
  if (ua.includes('windows')) {
    sistema = 'windows';
  } else if (ua.includes('macintosh') || ua.includes('mac os')) {
    sistema = 'mac';
  } else if (ua.includes('linux') && !ua.includes('android')) {
    sistema = 'linux';
  } else if (ua.includes('android')) {
    sistema = 'android';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    sistema = 'ios';
  }
  
  return {
    tipo,
    navegador,
    sistema
  };
}

module.exports = registrarAcceso;