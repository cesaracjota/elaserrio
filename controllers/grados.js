const { response } = require("express");
const Grado = require("../models/grado");
const mongoose = require("mongoose");

const getGrados = async (req, res = response) => {
  try {
    const grados = await Grado.find()
      .populate("docente_titular sede")
      .sort({ updatedAt: -1 });
    res.json(grados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const getGrado = async (req, res = response) => {
  try {
    const grado = await Grado.findById(req.params.id).populate(
      "docente_titular sede"
    );
    res.json(grado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const getGradosBySede = async (req, res = response) => {
  try {
    const grades = await Grado.find({ sede: req.params.id })
      .populate("docente_titular sede")
      .sort({ updatedAt: -1 });
    res.json(grades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const getGradosByDocente = async (req, res = response) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, msg: "ID inválido" });
    }

    // Buscar grados del docente
    const grados = await Grado.find({ docente_titular: id })
      .populate("docente_titular sede")
      .sort({ updatedAt: -1 });

    res.json(grados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const crearGrado = async (req, res = response) => {
  try {
    
    const grado = new Grado(req.body);

    await grado.save();

    // Populamos el grado para devolver la información completa
    const gradoDB = await Grado.findById(grado._id).populate(
      "docente_titular sede"
    );

    res.status(201).json(gradoDB);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const actualizarGrado = async (req, res = response) => {
  try {
    const gradoActualizado = await Grado.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("docente_titular sede");
    res.json(gradoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const eliminarGrado = async (req, res = response) => {
  try {
    const gradoDB = await Grado.findById(req.params.id);

    if (!gradoDB) {
      return res
        .status(400)
        .json({ ok: false, msg: "El grado seleccionado no existe" });
    }

    const gradoDelete = await Grado.findByIdAndDelete(req.params.id);
    res.json(gradoDelete);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

module.exports = {
  getGrados,
  getGrado,
  crearGrado,
  actualizarGrado,
  eliminarGrado,
  getGradosBySede,
  getGradosByDocente,
};
