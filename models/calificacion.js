const { Schema, model } = require("mongoose");

const CalificacionSchema = Schema(
  {
    matricula: { 
      type: Schema.Types.ObjectId, 
      ref: "Matricula",
      required: true
    },
    curso: { 
      type: Schema.Types.ObjectId, 
      ref: "Curso",
      required: true
    },
    bimestres: [
      {
        numeroBimestre: {
          type: Number,
          enum: [1, 2, 3, 4],
        },
        actividades: [
          {
            tipo: {
              type: String,
              enum: ["Examen", "Tarea", "Proyecto", "Practica", "Participación"]
            },
            valor: {
              type: Number,
              min: 0,
              max: 100
            }
          }
        ],
        promedioBimestral: {
          type: Number,
          min: 0,
          max: 10,
          default: 0
        },
      }
    ],
    promedioGeneral: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    estadoFinal: {
      type: String,
      enum: ["Aprobado", "Reprobado", "Pendiente"],
      default: "Pendiente"
    },
    profesor: { 
      type: Schema.Types.ObjectId, 
      ref: "Usuario"
    }
  },
  { 
    collection: "Calificacion", 
    timestamps: true, 
    versionKey: false 
  }
);

// Calcular promedios antes de guardar
CalificacionSchema.pre("save", function (next) {
  // Calcular promedio por bimestre
  this.bimestres.forEach(bimestre => {
    if (bimestre.actividades.length > 0) {
      const total = bimestre.actividades.reduce((acc, actividad) => acc + actividad.valor, 0);
      bimestre.promedioBimestral = (total / bimestre.actividades.length).toFixed(2);
      bimestre.estadoBimestre = bimestre.promedioBimestral >= 60 ? "Aprobado" : "Reprobado";
    }
  });

  // Calcular promedio general
  if (this.bimestres.length > 0) {
    const totalGeneral = this.bimestres.reduce((acc, bimestre) => acc + bimestre.promedioBimestral, 0);
    this.promedioGeneral = (totalGeneral / this.bimestres.length).toFixed(2);
    this.estadoFinal = this.promedioGeneral >= 60 ? "Aprobado" : "Reprobado";
  }
  
  next();
});

module.exports = model("Calificacion", CalificacionSchema);