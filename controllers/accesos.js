// roles controller

const Acceso = require('../models/acceso');

const getAccesos = async (req, res = response) => {
  try {
    const sort = { fecha: -1 };
    const accesos = await Acceso.find().populate('usuario', 'nombre apellido correo rol').sort(sort);
    res.json(accesos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const deleteAcceso = async (req, res = response) => {
  try {
    const { id } = req.params;
    const acceso = await Acceso.findByIdAndDelete(id).populate('usuario', 'nombre correo rol');
    res.json(acceso);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

module.exports = {
    getAccesos,
    deleteAcceso,
};