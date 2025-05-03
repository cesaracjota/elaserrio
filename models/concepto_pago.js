const { Schema, model } = require('mongoose');

const ConceptoPagoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    precio: {
        type: Number,
    },
    descripcion: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, { collection: 'concepto_pago', timestamps: true, versionKey: false });

module.exports = model('ConceptoPago', ConceptoPagoSchema);