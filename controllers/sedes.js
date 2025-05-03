const { response } = require("express");
const Sede = require("../models/sede");
const { default: mongoose } = require("mongoose");

const getSedes = async (req, res = response) => {
  try {
    const sort = { updatedAt: -1 };

    const sedes = await Sede.find().sort(sort);

    res.json(sedes);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getSede = async (req, res = response) => {
  try {
    const sort = { updatedAt: -1 };

    const sede = await Sede.findById(req.params.id).sort(sort);

    res.json(sede);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const crearSede = async (req, res = response) => {
  try {
    const { nombre } = req.body;

    const sedeDB = await Sede.findOne({ nombre });

    if (sedeDB) {
      return res.status(400).json({
        ok: false,
        msg: "El sede ya existe",
      });
    }

    const data = {
      ...req.body,
      slug: nombre.toLowerCase().replace(/\s/g, "-"),
    };

    const sede = new Sede(data);

    await sede.save();

    res.status(201).json(sede);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarSede = async (req, res = response) => {
  try {
    const { nombre } = req.body;

    const nuevoSede = {
      ...req.body,
      slug: nombre.toLowerCase().replace(/\s/g, "-"),
    };

    const sort = { updatedAt: -1 };

    const sedeActualizado = await Sede.findByIdAndUpdate(
      req.params.id,
      nuevoSede,
      { new: true }
    ).sort(sort);

    res.json(sedeActualizado);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarSede = async (req, res = response) => {
  try {
    const sedeDB = await Sede.findOne(req.params._id);
    if (!sedeDB) {
      return res.status(400).json({
        ok: false,
        msg: "El sede seleccionado, no existe",
      });
    }

    const { id } = req.params;
    const sede = await Sede.findByIdAndDelete(id);
    res.json(sede);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getSedes,
  getSede,
  crearSede,
  actualizarSede,
  eliminarSede,
};
