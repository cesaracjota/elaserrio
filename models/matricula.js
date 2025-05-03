const { Schema, model } = require("mongoose");

const MatriculaSchema = new Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: (v) => v.toUpperCase(),
    },
    estudiante: {
      type: Schema.Types.ObjectId,
      ref: "Estudiante",
      required: true,
    },
    academic_year: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
    },
    grado: { type: Schema.Types.ObjectId, ref: "Grado", required: true },
    sede: { type: Schema.Types.ObjectId, ref: "Sede", required: true },

    // observaciones por periodo
    observacionesPeriodo: {
      type: [
        {
          periodo: { type: Number, min: 1, max: 4 },
          academica: { type: String, trim: true },
          comportamental: { type: String, trim: true },
        },
      ],
    },

    // Promedio general
    promedioGeneral: { type: Number, min: 0, max: 10, default: 0 },

    // ranking / puesto del estudiante
    ranking: { type: Number, default: 0 },

    estado: {
      type: String,
      enum: ["Activa", "Retirado", "Suspendida", "Finalizada"],
      default: "Activa",
    },
    observaciones: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "Matricula",
    timestamps: true,
    versionKey: false,
  }
);

// Índice único considerando el año académico
MatriculaSchema.index(
  { estudiante: 1, grado: 1, sede: 1, academic_year: 1 },
  { unique: true }
);

module.exports = model("Matricula", MatriculaSchema);
