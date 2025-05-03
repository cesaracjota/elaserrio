const mongoose = require('mongoose');

const egresoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  concepto: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
  },
  monto: {
    type: Number,
    required: true
  },
  categoria: {
    type: String,
    required: true,
    // enum: ['Salarios', 'Material Didáctico', 'Mantenimiento', 'Servicios', 'Equipamiento', 'Otros']
  },
  metodoPago: {
    type: String,
    required: false,
    enum: ['EFECTIVO', 'TARJETA DE CREDITO', 'TRANSFERENCIA BANCARIA', 'YAPE', 'OTRO']
  },
  comprobante: {
    type: String  // Podría ser un número de factura o recibo
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  departamento: {
    type: String
  },
  presupuestado: {
    type: Boolean,
    default: false
  },
  observaciones: String,
}, {
  timestamps: true,
  versionKey: false,
  collection: 'egresos',
});

module.exports = mongoose.model('Egreso', egresoSchema);