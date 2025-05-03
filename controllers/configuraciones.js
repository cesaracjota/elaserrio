const Configuracion = require("../models/configuracion");

// Obtener configuración actual
exports.obtenerConfiguracion = async (req, res) => {
  try {
    // get one config
    const configuraciones = await Configuracion.findOne();
    // get result in object {}
    res.json(configuraciones);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener configuración", error });
  }
};

exports.crearActualizarConfiguracion = async (req, res) => {
  try {
    const configExistente = await Configuracion.findOne();

    if (configExistente) {
      const configActualizada = await Configuracion.findOneAndUpdate(
        { _id: configExistente._id },
        req.body,
        { new: true, runValidators: true }
      );
      return res.status(200).json(configActualizada);
    }

    const configCreada = await Configuracion.create(req.body);
    return res.status(201).json(configCreada);

  } catch (error) {
    console.error("Error al crear o actualizar configuración:", error);
    return res.status(500).json({
      mensaje: "Ocurrió un error al procesar la configuración",
      error,
    });
  }
};

// Eliminar configuración
exports.eliminarConfiguracion = async (req, res) => {
  try {
    const configDB = await Configuracion.findOne();
    if (!configDB) {
      return res.status(404).json({
        mensaje: "Configuración no encontrada",
      });
    }
    await Configuracion.findOneAndDelete();
    res.json(configDB);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar configuración",
      error,
    });
  }
};
