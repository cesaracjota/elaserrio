const { Schema, model } = require("mongoose");

const indicadorePeriodoSchema = new Schema(
  {
    indicador: { type: String, trim: true },
  },
  { _id: false }
);

const NotaSchema = new Schema(
  {
    matricula: {
      type: Schema.Types.ObjectId,
      ref: "Matricula",
      required: true,
    },
    materia: { type: Schema.Types.ObjectId, ref: "Materia", required: true },
    profesor: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },

    // Notas por bimestre
    bimestre1: { type: Number, min: 0, max: 10, default: 0 },
    bimestre2: { type: Number, min: 0, max: 10, default: 0 },
    bimestre3: { type: Number, min: 0, max: 10, default: 0 },
    bimestre4: { type: Number, min: 0, max: 10, default: 0 },

    fallas: { type: Number },

    // indicadores maximo 4 por periodo
    indicadores: [
      {
        periodo: { type: Number },
        indicador: [indicadorePeriodoSchema],
      },
    ],

    // calificacion para nivel inicial
    valoraciones: [
      {
        _id: false,
        periodo: { type: Number },
        valoracion: { type: String, trim: true },
      },
    ],

    // Promedio
    promedio: { type: Number, default: 0 },

    // Observación general
    observaciones: { type: String, trim: true },

    // Estado
    estado: {
      type: String,
      enum: ["Pendiente", "Aprobado", "Reprobado"],
      default: "Pendiente",
    },
  },
  {
    collection: "Notas",
    timestamps: true,
    versionKey: false,
  }
);

// Índice único por matrícula y materia
NotaSchema.index({ matricula: 1, materia: 1 }, { unique: true });

module.exports = model("Nota", NotaSchema);
