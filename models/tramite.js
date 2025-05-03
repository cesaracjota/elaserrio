const mongoose = require('mongoose');

const tramiteSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  tipoTramite: {
    type: String,
    required: true,
    // enum: ['constanciaTrabajo', 'boletaPago']
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  solicitante: {
    nombres: String,
    apellidos: String,
    dni: String,
    tipo: String,
    email: String,
    celular: String,
    direccion: String,
    telefono: String,
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  datosConstancia: {
    cargo: String,
    fechaIngreso: Date
  },
  datosBoletaPago: {
    mes: {
      type: String,
      enum: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    },
    año: Number,
    montoBruto: Number,
    aportaciones: Number,
    descuentos: Number,
    montoNeto: Number
  },  
  estado: {
    type: String,
    enum: ['pendiente', 'procesado', 'entregado'],
    default: 'pendiente'
  },
  observaciones: String,
  fechaGeneracion: Date,
  archivoGenerado: String // Nombre del archivo generado
}, {
  timestamps: true,
  versionKey: false,
  collection: 'tramites'
});

module.exports = mongoose.model('Tramite', tramiteSchema);