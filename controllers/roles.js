// roles controller

const Roles = require('../models/rol');

const getRoles = async (req, res = response) => {
  try {
    const roles = await Roles.find().populate('modulos');
    res.json(roles);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const getRole = async (req, res = response) => {
  try {
    const role = await Roles.findById(req.params.id).populate('modulos');
    res.json(role);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const createRole = async (req, res = response) => {
  try {
    const { nombre, slug, descripcion, modulos } = req.body;

    const rol = await Roles.findOne({ nombre });

    if (rol) {
      return res.status(400).json({
        ok: false,
        msg: 'El rol ya existe',
      });
    }


    if (rol) {
      return res.status(400).json({
        ok: false,
        msg: 'El rol ya existe',
      });
    }

    const role = new Roles({
      nombre,
      slug,
      descripcion,
      modulos,
    });

    await role.save();

    // Populate
    const roleNewData = await role.populate('modulos');

    res.status(201).json(roleNewData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const updateRole = async (req, res = response) => {
  try {
    
    const { id } = req.params;

    const role = await Roles.findByIdAndUpdate(id, req.body, { new: true }).populate('modulos');

    res.json(role);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const deleteRole = async (req, res = response) => {
  try {
    const { id } = req.params;
    const role = await Roles.findByIdAndDelete(id).populate('modulos');
    res.json(role);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

module.exports = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
};