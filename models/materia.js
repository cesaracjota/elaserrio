const mongoose = require("mongoose");
const { Schema } = mongoose;

const materiaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      set: (v) => v.toUpperCase(),
    },
    descripcion: {
      type: String,
      trim: true,
    },
    brand_color: {
      type: String,
      default: "#000000",
    },
    grado: {
      type: Schema.Types.ObjectId,
      ref: "Grado",
      required: true,
    },
    horario: [
      {
        title: String,
        day: String,
        start: String,
        end: String,
        aula: String,
        description: String,
      },
    ],
    intensidadHorariaSemanal: {
      type: Number,
      default: 0,
    },
    sede: {
      type: Schema.Types.ObjectId,
      ref: "Sede",
    },
    docente: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
    estado: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Materia", materiaSchema);