// materia controller

const { response } = require("express");
const mongoose = require("mongoose");
const Materia = require("../models/materia");
const Usuario = require("../models/usuario");
const Matricula = require("../models/matricula");
const AcademicYear = require("../models/academic_year");

const getMaterias = async (req, res = response) => {
  try {
    const sort = { updatedAt: -1 };

    const materias = await Materia.find()
      .populate("grado docente sede")
      .sort(sort);

    res.json(materias);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getMateria = async (req, res = response) => {
  try {
    const materia = await Materia.findById(req.params.id).populate(
      "grado docente"
    );

    res.json(materia);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getMateriasBySede = async (req, res = response) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, msg: "ID inválido" });
    }

    // Buscar materias del sede
    const materias = await Materia.find({ sede: id }).populate(
      "grado docente sede"
    );

    res.json(materias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const getMateriasByTeacher = async (req, res = response) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, msg: "ID inválido" });
    }

    // Buscar al docente
    const docenteDB = await Usuario.findById(id);
    if (!docenteDB) {
      return res.status(404).json({ ok: false, msg: "Docente no encontrado" });
    }

    // Buscar materias asignadas al docente y docente titular
    const materias = await Materia.find({ $or: [{ docente: id }] }).populate(
      "grado docente sede"
    );

    // Si no hay materias asignadas
    if (materias.length === 0) {
      return res
        .status(404)
        .json({ ok: false, msg: "El docente no tiene materias asignadas" });
    }

    // Obtener el conteo de estudiantes por grado (y, por lo tanto, por materia)
    const materiasConEstudiantes = await Promise.all(
      materias.map(async (materia) => {
        const activeAcademicYear = await AcademicYear.findOne({
          isActive: true,
        });
        const totalEstudiantes = await Matricula.countDocuments({
          grado: materia.grado._id,
          academic_year: activeAcademicYear._id,
        });
        return {
          _id: materia._id,
          nombre: materia.nombre,
          grado: materia.grado,
          docente: materia.docente,
          sede: materia.sede,
          horario: materia.horario,
          descripcion: materia.descripcion,
          brand_color: materia.brand_color,
          totalEstudiantes,
        };
      })
    );

    res.json(materiasConEstudiantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const getMateriasByGrado = async (req, res = response) => {
  try {
    const { id } = req.params;
    const materias = await Materia.find({ grado: id }).populate("grado docente sede");

    const activeAcademicYear = await AcademicYear.findOne({ isActive: true }); // <--- AQUÍ faltaba await

    const materiasConEstudiantes = await Promise.all(
      materias.map(async (materia) => {
        const totalEstudiantes = await Matricula.countDocuments({
          grado: id,
          academic_year: activeAcademicYear?._id,
        }); // <--- AQUÍ quitar populate

        return {
          _id: materia._id,
          nombre: materia.nombre,
          grado: materia.grado,
          docente: materia.docente,
          sede: materia.sede,
          descripcion: materia.descripcion,
          brand_color: materia.brand_color,
          horario: materia.horario,
          intensidadHorariaSemanal: materia.intensidadHorariaSemanal,
          esPublico: materia.esPublico,
          estado: materia.estado,
          totalEstudiantes,
        };
      })
    );

    res.json(materiasConEstudiantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const crearMateria = async (req, res = response) => {
  try {
    const nuevaMateria = new Materia(req.body);

    await nuevaMateria.save();

    const data = await nuevaMateria.populate("grado docente sede");

    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarMateria = async (req, res = response) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una materia con ese id",
      });
    }

    const nuevaMateria = {
      ...req.body,
      nombre: nombre,
      slug: nombre.toLowerCase().replace(/\s+/g, "-"),
    };

    const materiaDB = await Materia.findByIdAndUpdate(
      req.params.id,
      nuevaMateria,
      { new: true }
    ).populate("grado docente");

    res.json(materiaDB);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarMateria = async (req, res = response) => {
  try {
    const { id } = req.params;

    const materiaDB = await Materia.findById(id);

    if (!materiaDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una materia con ese id",
      });
    }

    await Materia.findByIdAndDelete(id);

    res.json(materiaDB);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getMaterias,
  getMateria,
  getMateriasByGrado,
  getMateriasBySede,
  getMateriasByTeacher,
  crearMateria,
  actualizarMateria,
  eliminarMateria,
};
