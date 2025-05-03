const { Schema, model, default: mongoose } = require("mongoose");

// Definir valores permitidos para nivel y estado
const NIVELES = ["INICIAL", "PRIMARIA", "SECUNDARIA", "OTRO"];
const ESTADOS = ["activo", "inactivo"];

const GradoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      set: (v) => v.toUpperCase(),
    },
    nivel: {
      type: String,
      enum: NIVELES,
      required: true,
    },
    sede: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
    },
    docente_titular: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    estado: {
      type: String,
      enum: ESTADOS,
      default: "activo",
    },
  },
  { collection: "Grado", timestamps: true, versionKey: false }
);

module.exports = model("Grado", GradoSchema);
