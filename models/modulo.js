const { Schema, model, default: mongoose } = require('mongoose');

const ModuloSchema = Schema({
    position: {
        type: Number,
    },
    name: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    icon: {
        type: String,
        required: [true, 'El icono es obligatorio']
    },
    path: {
        type: String,
        required: [true, 'El path es obligatorio']
    },
    estado: {
        type: String,
        default: 'activo'
    },
}, { collection: 'modulo', timestamps: true, versionKey: false });

module.exports = model('Modulo', ModuloSchema);