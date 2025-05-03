const { response } = require("express");

const Estudiante = require("../models/estudiante");

const getEstudiantes = async (req, res = response) => {
  try {
    const desde = Math.max(0, Number(req.query.desde) || 0);
    const hasta = Math.max(0, Number(req.query.hasta) || 10);
    const idSede = req.query.id;

    if (hasta <= 0 || desde >= hasta) {
      return res.json({
        estudiantes: [],
        total: 0,
      });
    }

    const limite = hasta - desde;

    const [estudiantes, total] = await Promise.all([
      Estudiante.find({ sede: idSede })
        .sort({ updatedAt: -1 })
        .skip(desde)
        .limit(limite)
        .lean(),
      Estudiante.countDocuments(),
    ]);

    res.json({
      estudiantes,
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

const getEstudiante = async (req, res = response) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        msg: "Estudiante no encontrado",
      });
    }

    res.json({
      ok: true,
      estudiante,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const registrarEstudiante = async (req, res = response) => {
  try {
    const { dni } = req.body;

    const estudianteDB = await Estudiante.findOne({ dni });

    if (estudianteDB) {
      return res.status(400).json({
        ok: false,
        msg: "El estudiante con ese DNI ya existe",
      });
    }

    const estudiante = new Estudiante({
      ...req.body,
      img:
        req.body.sexo === "M"
          ? `https://avatar.iran.liara.run/public/boy?id=${req.body.dni}`
          : `https://avatar.iran.liara.run/public/girl?id=${req.body.dni}`,
    });

    await estudiante.save();

    res.status(201).json(estudiante);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarEstudiante = async (req, res = response) => {
  const id = req.params.id;

  try {
    const estudianteDB = await Estudiante.findById(id);

    if (!estudianteDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un estudiante con ese id",
      });
    }

    const cambiosEstudiante = {
      ...req.body,
      img:
        req.body.sexo === "M"
          ? `https://avatar.iran.liara.run/public/boy?id=${req.body.dni}`
          : `https://avatar.iran.liara.run/public/girl?id=${req.body.dni}`,
    };

    const estudianteActualizado = await Estudiante.findByIdAndUpdate(
      id,
      cambiosEstudiante,
      { new: true }
    );

    res.json({
      ok: true,
      estudiante: estudianteActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarEstudiante = async (req, res = response) => {
  try {
    const { id } = req.params;

    const estudiante = await Estudiante.findByIdAndDelete(id);

    res.json({
      ok: true,
      estudiante,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getEstudianteByDni = async (req, res = response) => {
  try {
    const { dni } = req.params;

    const estudiante = await Estudiante.findOne({ dni });

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        msg: "El estudiante no ha sido encontrado",
      });
    }

    res.json(estudiante);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getEstudiantebyGrado = async (req, res = response) => {
  try {
    const { id } = req.params;

    const estudiantes = await Estudiante.find({ grado: id });

    if (!estudiantes) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un estudiante con ese id",
      });
    }
    res.json(estudiantes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// Modifica tu controlador
const searchStudent = async (req, res) => {
  try {
    const { search, idSede } = req.query;

    if (!search || search.trim() === "") {
      return res.status(400).json({
        ok: false,
        msg: "El término de búsqueda es requerido",
      });
    }

    const regex = new RegExp(search, "i");

    const estudiantes = await Estudiante.find({ sede: idSede }).or([
      { nombres: regex },
      { apellidos: regex },
      { dni: regex },
    ]);

    res.json(estudiantes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor, hable con el administrador",
    });
  }
};

module.exports = {
  getEstudiantes,
  getEstudiante,
  registrarEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  getEstudianteByDni,
  searchStudent,
  getEstudiantebyGrado,
};
