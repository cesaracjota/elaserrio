const { Schema, model } = require('mongoose');

const PagoSchema = Schema({
    codigo: {
        type: String,
        unique: true,
    },
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: [true, 'El estudiante es obligatorio'],
        autopopulate: true,
    },
    concepto: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ConceptoPago',
            autopopulate: true,
            required: false,
            default: null,
        }
    ],
    uniforme: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Uniforme',
            autopopulate: true,
            required: false,
            default: null,
        }
    ],
    meses: {
        type: [String],
    },
    anio: {
        type: String,
    },
    importe: {
        type: Number,
        required: [true, 'El importe es obligatorio'],
    },
    metodo_pago: {
        type: String,
        default: 'EFECTIVO',
    },
    descripcion: {
        type: String,
    },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'INCOMPLETO', 'CANCELADO'],
        default: 'PENDIENTE',
    },
    observaciones: {
        type: String,
    },

}, { collection: 'pagos', timestamps: true, versionKey: false });

module.exports = model('Pagos', PagoSchema);