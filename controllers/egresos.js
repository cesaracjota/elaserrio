const { response } = require("express");
const Egreso = require("../models/egreso");
const { validarJWT } = require('../middlewares/validar-jwt'); 

const getEgresos = async (req, res = response) => {
  try {
    const desde = Math.max(0, Number(req.query.desde) || 0);
    const hasta = Math.max(0, Number(req.query.hasta) || 10);

    if (hasta <= 0 || desde >= hasta) {
      return res.json({
        egresos: [],
        total: 0,
      });
    }

    const limite = hasta - desde; // Calcular el límite correcto

    const [egresos, total] = await Promise.all([
      Egreso.find()
        .populate("responsable", "nombre correo rol")
        .sort({ updatedAt: -1 })
        .skip(desde)
        .limit(limite)
        .lean(),
      Egreso.countDocuments(),
    ]);

    res.json({
      egresos,
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

const getEgreso = async (req, res = response) => {
  try {
    const egreso = await Egreso.findById(req.params.id)
      .populate("responsable", "nombre correo rol");

    if (!egreso) {
      return res.status(404).json({
        ok: false,
        msg: "Registro de egreso no encontrado",
      });
    }

    res.json(egreso);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const registrarEgreso = async (req, res = response) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear().toString();

    // Obtener el último egreso registrado
    const lastPayment = await Egreso.findOne(
      {},
      {},
      { sort: { codigo: -1 } }
    ).exec();

    let codigo;
    if (lastPayment && typeof lastPayment.codigo === "string") {
      const lastPaymentYear = lastPayment.codigo.substring(0, 4);

      // Incrementar el contador si el año es el mismo, o establecerlo en 1 si es diferente
      const lastPaymentCount = parseInt(lastPayment.codigo.substring(5));
      const contador =
        lastPaymentYear === currentYear ? lastPaymentCount + 1 : 1;

      // Generar el código con el año actual y el contador
      codigo = `${currentYear}-${contador.toString().padStart(3, "0")}`;
    } else {
      // No hay EggetEgresos registrados o el campo 'codigo' no es una cadena de texto válida, generar el primer código del año actual
      codigo = `${currentYear}-001`;
    }

    // Verificar si el código ya existe
    while (await Egreso.exists({ codigo })) {
      const lastCodeCount = parseInt(codigo.substring(5));
      codigo = `${currentYear}-${(lastCodeCount + 1)
        .toString()
        .padStart(3, "0")}`;
    }

    req.body.codigo = codigo;
    req.body.responsable = req.uid;

    const egreso = new Egreso(req.body);

    await egreso.save();

    // Populate del modelo de egreso para obtener la referencia al estudiante
    const egresoPopulado = await Egreso.findById(egreso._id)
      .populate("responsable", "nombre correo rol")
      .exec();

    res.json({
      ok: true,
      egreso: egresoPopulado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarEgreso = async (req, res = response) => {
  try {
    const { id } = req.params;

    req.body.responsable = req.uid;

    const egreso = await Egreso.findByIdAndUpdate(id, req.body, { new: true })
      .populate("responsable", "nombre correo rol");

    res.json(egreso);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarEstadoEgreso = async (req, res = response) => {
  try {
    const { id } = req.params;

    // Verificar si el pago existe en la base de datos
    const egreso = await Egreso.findById(id).populate("responsable", "nombre correo rol");

    if (!egreso) {
      return res.status(404).json({
        ok: false,
        msg: "El egreso no existe",
      });
    }

    // Actualizar el estado del egreso

    if (egreso.estado === "PENDIENTE" || egreso.estado === "INCOMPLETO") {
      egreso.importe = egreso.concepto.reduce(
        (acum, item) => acum + item.precio,
        0.0
      );
      egreso.observaciones = "Egreso cancelado por el usuario";
      egreso.estado = "CANCELADO";
    }

    await egreso.save();

    const egresoActualizada = await Egreso.findOne({ _id: egreso._id })
      .populate("usuario");

    res.json({
      ok: true,
      msg: "Estado del egreso actualizado exitosamente",
      pago: egresoActualizada,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarEgreso = async (req, res = response) => {
  try {
    const { id } = req.params;

    const egreso = await Egreso.findByIdAndDelete(id);

    res.json(egreso);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEgresos,
  getEgreso,
  registrarEgreso,
  actualizarEgreso,
  eliminarEgreso,
  actualizarEstadoEgreso,
};
