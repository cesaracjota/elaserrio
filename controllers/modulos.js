// controler para modulo

const Modulo = require("../models/modulo");

const getModulos = async (req, res = response) => {
  try {
    const sort = { position: +1 };

    const modulos = await Modulo.find().sort(sort);

    res.json(modulos);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getModulo = async (req, res = response) => {
  try {
    const sort = { position: +1 };

    const modulo = await Modulo.findById(req.params.id).sort(sort);

    res.json(modulo);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const crearModulo = async (req, res = response) => {
  try {
    const {position, name, icon, path } = req.body;

    const moduloDB = await Modulo.findOne({ name });

    if (moduloDB) {
      return res.status(400).json({
        ok: false,
        msg: "El modulo ya existe",
      });
    }

    const data = {
      position,
      name,
      icon,
      path
    };

    const modulo = new Modulo(data);

    await modulo.save();

    res.status(201).json(modulo);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarModulo = async (req, res = response) => {
  try {

    const nuevoModulo = {
      ...req.body,
    };

    const sort = { updatedAt: -1 };

    const moduloActualizado = await Modulo.findByIdAndUpdate(
      req.params.id,
      nuevoModulo,
      { new: true }
    ).sort(sort);

    res.json(moduloActualizado);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarModulo = async (req, res = response) => {
  try {
    const moduloDB = await Modulo.findOne(req.params._id);

    if (!moduloDB) {
      return res.status(400).json({
        ok: false,
        msg: "El modulo seleccionado, no existe",
      });
    }

    const { id } = req.params;
    const modulo = await Modulo.findByIdAndDelete(id);
    res.json(modulo);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getModulos,
  getModulo,
  crearModulo,
  actualizarModulo,
  eliminarModulo,
};
