const { Schema, model } = require("mongoose");

const Configuracion = Schema(
  {
    // Mantenemos el nombre como String
    nombreColegio: {
      type: String,
      default: "I.E. EL ALSERRIO",
      trim: true,
    },

    // permisos para el docente
    permitirRegistrarNotas: {
      type: Boolean,
      default: false,
    },
    permitirModificarNotas: {
      type: Boolean,
      default: false,
    },
    permitirRegistrarMatriculas: {
      type: Boolean,
      default: false,
    },
    permitirModificarMatriculas: {
      type: Boolean,
      default: false,
    },
    permitirDescargarMatriculas: {
      type: Boolean,
      default: false,
    },
    permitirDescargarFichaMatricula: {
      type: Boolean,
      default: false,
    },
    permitirEliminarMatriculas: {
      type: Boolean,
      default: false,
    },
    permitirRegistrarObservadores: {
      type: Boolean,
      default: false,
    },
    permitirDescargarObservadores: {
      type: Boolean,
      default: false,
    },
    permitirDescargarBoletin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Configuracion",
  }
);

// Método para verificar si una operación está habilitada y dentro del rango de fechas
Configuracion.methods.estaHabilitado = function (campo) {
  // Primero verificamos si el permiso está activado
  if (!this[campo]) {
    return false;
  }

  // Si el campo requiere verificación de fechas
  const fechaInicio = this[`fechaInicio${campo.charAt(0).toUpperCase() + campo.slice(1).replace("permitir", "")}`];
  const fechaFin = this[`fechaFin${campo.charAt(0).toUpperCase() + campo.slice(1).replace("permitir", "")}`];
  
  // Si hay fechas definidas, verificamos que estemos dentro del rango
  if (fechaInicio && fechaFin) {
    const ahora = new Date();
    return ahora >= fechaInicio && ahora <= fechaFin;
  }
  
  // Si no hay fechas, el permiso está habilitado sin restricción temporal
  return true;
};

module.exports = model("Configuracion", Configuracion);