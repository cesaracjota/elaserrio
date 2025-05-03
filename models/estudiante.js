const { Schema, model } = require("mongoose");

const EstudianteSchema = new Schema(
  {
    nombres: { type: String, required: true, trim: true, set: (v) => v.toUpperCase() },
    apellidos: { type: String, required: true, trim: true, set: (v) => v.toUpperCase() },
    tipo_documento: {
      type: String,
      enum: ["RC", "TI", "CC"],
      required: true,
    },
    dni: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d+$/, "El número de identificación debe contener solo números"],
    },

    lugar_expedicion: { type: String, trim: true, set: (v) => v.toUpperCase() },

    fecha_nacimiento: { type: Date },
    edad: { type: Number, min: 0 },
    sexo: { type: String, enum: ["M", "F"], required: true },

    municipio_nacimiento: { type: String, trim: true, set: (v) => v.toUpperCase() },
    departamento_nacimiento: { type: String, trim: true, set: (v) => v.toUpperCase() },
    nacionalidad: {
      type: String,
      default: "Colombiana",
      set: (v) => v.toUpperCase(),
    },

    direccion_residencia: { type: String, trim: true, set: (v) => v.toUpperCase() },
    vereda: { type: String, trim: true, set: (v) => v.toUpperCase() },
    estrato: { type: Number, min: 1, max: 6 },
    nivel_sisben: { type: String, trim: true },

    celular: {
      type: String,
      match: [/^\d{9,10}$/, "Número de celular inválido"],
    },
    correo: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Correo inválido"],
    },

    // Información religiosa
    credo_religioso: {
      type: String,
      default: "CRISTIANO CATOLICO",
    },
    denominacion: { type: String, trim: true },

    // Información de vulnerabilidad
    victima_conflicto: { type: Boolean, default: false },
    desplazado: { type: Boolean, default: false },
    desvinculado_armado: { type: Boolean, default: false },
    depto_expulsor: { type: String, trim: true },
    municipio_expulsor: { type: String, trim: true },

    grupo_etnico: {
      type: String,
    },

    // Capacidades y limitaciones
    limitaciones: [String],
    capacidades_excepcionales: [String],
    coeficiente_intelectual: { type: Number, min: 0, max: 200 },

    // Información familiar
    padre: {
      nombre: { type: String, trim: true },
      cc: { type: String, trim: true },
      celular: { type: String, trim: true },
    },
    madre: {
      nombre: { type: String, trim: true },
      cc: { type: String, trim: true },
      celular: { type: String, trim: true },
    },
    acudiente: {
      nombre: { type: String, trim: true },
      cc: { type: String, trim: true },
      celular: { type: String, trim: true },
    },

    // Salud
    eps: { type: String, trim: true },
    ips: { type: String, trim: true },
    regimen_salud: { type: String },
    grupo_sanguineo: { type: String, trim: true },
    rh: { type: String, trim: true },

    // SISBEN
    categoria_sisben: {
      type: String,
    },
    subcategoria_sisben: { type: String, trim: true },

    // Otros campos
    img: { type: String, trim: true },
    observaciones: { type: String, trim: true },
    estado: {
      type: String,
      default: "ACTIVO",
    },

    sede: { type: Schema.Types.ObjectId, ref: "Sede" },
    turno: {
      type: String,
      default: "MAÑANA",
    },
  },
  {
    collection: "estudiantes",
    timestamps: true,
    versionKey: false,
  }
);

// Índices
EstudianteSchema.index({ nombres: 1, apellidos: 1 });

// Validación duplicados
EstudianteSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("El número de identificación ya está registrado."));
  } else {
    next(error);
  }
});

module.exports = model("Estudiante", EstudianteSchema);
