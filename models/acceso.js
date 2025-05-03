// models/acceso.js
const { Schema, model } = require('mongoose');

const AccesoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    ruta: {
        type: String,
        required: true
    },
    metodo: {
        type: String,
        required: true
    },
    fechaHora: {
        type: Date,
        default: Date.now
    },
    ip: {
        type: String,
        required: true
    },
    ubicacion: {
        pais: String,
        region: String,
        ciudad: String,
        coordenadas: [Number], // [latitud, longitud]
        timezone: String
    },
    userAgent: {
        type: String
    },
    estadoRespuesta: {
        type: Number
    },
    referer: {
        type: String
    },
    dispositivo: {
        tipo: String,      // desktop, mobile, tablet
        navegador: String, // chrome, firefox, safari, edge, ie, opera, otro
        sistema: String    // windows, mac, linux, android, ios, otro
    },
    sesionId: {
        type: String
    },
    query: {
        type: String
    },
    tipoContenido: {
        type: String
    },
    estado: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento en consultas frecuentes
AccesoSchema.index({ usuario: 1, fechaHora: -1 });
AccesoSchema.index({ ip: 1 });
AccesoSchema.index({ fechaHora: -1 });
AccesoSchema.index({ 'ubicacion.pais': 1 });
AccesoSchema.index({ 'dispositivo.tipo': 1 });
AccesoSchema.index({ 'dispositivo.navegador': 1 });

module.exports = model('Acceso', AccesoSchema);