const { Schema, model } = require("mongoose");

const UsuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "Los nombres y apellidos son obligatorios"],
      trim: true,
      set: (v) => v.toUpperCase(),
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor ingrese un correo válido"],
    },
    sexo: {
      type: String,
      enum: ["M", "F"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    rol: {
      type: String,
      enum: ["SUPER_ADMIN_ROLE", "ADMIN_ROLE", "DOCENTE_ROLE", "ESTUDIANTE_ROLE", "SECRETARIA_ROLE", "DOCENTE_TITULAR_ROLE"],
      default: "DOCENTE_ROLE",
    },
    img: {
      type: String,
      trim: true,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    sedes: [{ type: Schema.Types.ObjectId, ref: "Sede" }],
  },
  { collection: "usuario", timestamps: true, versionKey: false }
);

module.exports = model("Usuario", UsuarioSchema);
