const { Schema, model } = require("mongoose");

const SedeSchema = Schema(
  {
    nombre: { type: String, required: true, set: (v) => v.toUpperCase() },
    direccion: { type: String },
    codigoDane: { type: String },
    telefono: { type: String },
    estado: { type: Boolean, default: true },
  },
  { collection: "sedes", timestamps: true, versionKey: false }
);

module.exports = model("Sede", SedeSchema);
