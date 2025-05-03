const { Schema, model, default: mongoose } = require('mongoose');

const RolSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    descripcion: {
        type: String,
    },
    estado: {
        type: String,
        default: 'activo',
    },
    modulos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Modulo",
      },
    ],

}, { collection: 'rol', timestamps: true, versionKey: false });

module.exports = model('Rol', RolSchema);