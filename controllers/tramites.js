const { response } = require("express");
const Tramite = require("../models/tramite");

const getTramites = async (req, res = response) => {
  try {
    const desde = Math.max(0, Number(req.query.desde) || 0);
    const hasta = Math.max(0, Number(req.query.hasta) || 10);

    if (hasta <= 0 || desde >= hasta) {
      return res.json({
        tramites: [],
        total: 0,
      });
    }

    const limite = hasta - desde; // Calcular el límite correcto

    const [tramite, total] = await Promise.all([
      Tramite.find()
        .populate("responsable", "nombre correo rol")
        .sort({ updatedAt: -1 })
        .skip(desde)
        .limit(limite)
        .lean(),
      Tramite.countDocuments(),
    ]);

    res.json({
      tramite,
      total,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getTramite = async (req, res = response) => {
  try {
    const tramite = await Tramite.findById(req.params.id)
      .populate("responsable", "nombre correo rol");

    if (!tramite) {
      return res.status(404).json({
        ok: false,
        msg: "Registro de tramite no encontrado",
      });
    }

    res.json(tramite);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const registrarTramite = async (req, res = response) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear().toString();

    // Obtener el último egreso registrado
    const lastData = await Tramite.findOne(
      {},
      {},
      { sort: { codigo: -1 } }
    ).exec();

    let codigo;
    if (lastData && typeof lastData.codigo === "string") {
      const lastDataYear = lastData.codigo.substring(0, 4);

      // Incrementar el contador si el año es el mismo, o establecerlo en 1 si es diferente
      const lastDataCount = parseInt(lastData.codigo.substring(5));
      const contador =
        lastDataYear === currentYear ? lastDataCount + 1 : 1;

      // Generar el código con el año actual y el contador
      codigo = `${currentYear}-${contador.toString().padStart(3, "0")}`;
    } else {
      // No hay EggetEgresos registrados o el campo 'codigo' no es una cadena de texto válida, generar el primer código del año actual
      codigo = `${currentYear}-001`;
    }

    // Verificar si el código ya existe
    while (await Tramite.exists({ codigo })) {
      const lastCodeCount = parseInt(codigo.substring(5));
      codigo = `${currentYear}-${(lastCodeCount + 1)
        .toString()
        .padStart(3, "0")}`;
    }

    req.body.codigo = codigo;

    const tramite = new Tramite(req.body);

    await tramite.save();

    // Populate del modelo de tramite para obtener la referencia al estudiante
    const tramitePopulado = await Tramite.findById(tramite._id)
      .populate("responsable", "nombre correo rol")
      .exec();

    res.json({
      ok: true,
      egreso: tramitePopulado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarTramite = async (req, res = response) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findByIdAndUpdate(id, req.body, { new: true })
      .populate("responsable", "nombre correo rol");

    res.json(tramite);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarEstadoTramite = async (req, res = response) => {
  try {
    const { id } = req.params;

    // Verificar si el pago existe en la base de datos
    const tramite = await Tramite.findById(id).populate("responsable", "nombre correo rol");

    if (!tramite) {
      return res.status(404).json({
        ok: false,
        msg: "El tramite no existe",
      });
    }

    // Actualizar el estado del tramite

    if (tramite.estado === "pendiente" || tramite.estado === "procesado") {
      tramite.observaciones = "tramite completado por el responsable";
      tramite.estado = "entregado";
    }

    await tramite.save();

    const tramiteActualizada = await Tramite.findOne({ _id: tramite._id })
      .populate("usuario");

    res.json({
      ok: true,
      msg: "Estado del tramite actualizado exitosamente",
      pago: tramiteActualizada,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarTramite = async (req, res = response) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findByIdAndDelete(id);

    res.json(tramite);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getTramites,
  getTramite,
  registrarTramite,
  actualizarTramite,
  eliminarTramite,
  actualizarEstadoTramite,
};
