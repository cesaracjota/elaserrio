const { response } = require("express");
const Nota = require("../models/nota");
const Matricula = require("../models/matricula");
const Estudiante = require("../models/estudiante");
const Materia = require("../models/materia");
const AcadeicYear = require("../models/academic_year");
const Usuario = require("../models/usuario");
const Grado = require("../models/grado");

const getAllReporte = async (req, res = response) => {
  try {
    const { page, perPage } = req.query;
    const pageNumber = parseInt(page) || 1;
    const perPageNumber = parseInt(perPage) || 10;
    const [notas, total] = await Promise.all([
      Nota.find()
        .populate("alumno", "nombre")
        .sort({ createdAt: -1 })
        .skip(perPageNumber * (pageNumber - 1))
        .limit(perPageNumber)
        .lean(),
      Nota.countDocuments(),
    ]);
    res.json(notas);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los datos",
    });
  }
};

// reportes para el administrador
// Este reporte es para el administrador y muestra un resumen de la sede

const getAllReportAdminBySede = async (req, res = response) => {
  try {
    const { sede } = req.query;

    if (!sede) {
      return res.status(400).json({
        ok: false,
        msg: "El parámetro 'sede' es requerido.",
      });
    }

    const academic_year = await AcadeicYear.findOne({ isActive: true });

    if (!academic_year) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontró un año académico activo.",
      });
    }

    // Consultas paralelas para mejorar performance
    const [
      totalEstudiantesMatriculados,
      totalEstudiantesGeneral,
      totalMaterias,
      totalDocentes,
      totalDocentesTitulares,
      totalUsuarios,
    ] = await Promise.all([
      Matricula.countDocuments({ sede, academic_year: academic_year._id }),
      Estudiante.countDocuments({ sede }),
      Materia.countDocuments({ sede }),
      Usuario.countDocuments({ rol: "DOCENTE_ROLE" }),
      Usuario.countDocuments({ rol: "DOCENTE_TITULAR_ROLE" }),
      Usuario.countDocuments({}),
    ]);

    res.json({
      totalEstudiantesMatriculados,
      totalEstudiantesGeneral,
      totalMaterias,
      totalDocentes,
      totalDocentesTitulares,
      totalUsuarios,
    });

  } catch (error) {
    console.error("Error al obtener el reporte de la sede:", error);
    res.status(500).json({
      ok: false,
      msg: "Error interno al generar el reporte.",
    });
  }
};

// Este reporte es para el docente titular y muestra un resumen de la sede

const getAllReportDocenteTitularBySede = async (req, res = response) => {
  try {
    const { sede } = req.query;
    const docenteId = req.uid; // Suponiendo que viene del middleware de autenticación

    if (!sede) {
      return res.status(400).json({
        ok: false,
        msg: "El parámetro 'sede' es requerido.",
      });
    }

    const academic_year = await AcadeicYear.findOne({ isActive: true });
    if (!academic_year) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontró un año académico activo.",
      });
    }

    // Buscar grados donde el docente es titular
    const gradosAsignados = await Grado.find({
      sede,
      docente_titular: docenteId,
    });

    if (gradosAsignados.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron grados asignados al docente titular.",
      });
    }

    const gradoIds = gradosAsignados.map((g) => g._id);

    // Buscar materias asignadas al docente (puedes ajustar según tu esquema: docente o docentes)
    const materiasAsignadas = await Materia.find({
      sede,
      docente: docenteId,
    }).populate("grado docente");

    const materiaIds = materiasAsignadas.map((m) => m._id);

    // Estudiantes matriculados en esos grados
    const estudiantesMatriculados = await Matricula.find({
      sede,
      academic_year: academic_year._id,
      grado: { $in: gradoIds },
    });

    res.json({
      ok: true,
      docente: docenteId,
      gradosAsignados: gradosAsignados.map(g => ({
        _id: g._id,
        nombre: g.nombre,
        nivel: g.nivel
      })),
      materias: materiasAsignadas.map(m => ({
        _id: m._id,
        nombre: m.nombre,
        descripcion: m.descripcion,
        brand_color: m.brand_color,
        grado: m.grado,
      })),
      resumen: {
        totalGradosAsignados: gradosAsignados.length,
        totalMateriasAsignadas: materiaIds.length,
        totalEstudiantesMatriculados: estudiantesMatriculados.length,
      },
    });
  } catch (error) {
    console.error("Error al obtener el reporte del docente titular:", error);
    res.status(500).json({
      ok: false,
      msg: "Error interno al generar el reporte.",
    });
  }
};


const getAllReportDocenteBySede = async (req, res = response) => {
  try {
    const { sede } = req.query;
    const docenteId = req.uid; // Suponiendo que viene del middleware de autenticación

    if (!sede) {
      return res.status(400).json({
        ok: false,
        msg: "El parámetro 'sede' es requerido.",
      });
    }

    const academic_year = await AcadeicYear.findOne({ isActive: true });
    if (!academic_year) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontró un año académico activo.",
      });
    }

    // Buscar materias asignadas al docente (puedes ajustar según tu esquema: docente o docentes)
    const materiasAsignadas = await Materia.find({
      sede,
      docente: docenteId,
    }).populate("grado");

    const materiaIds = materiasAsignadas.map((m) => m._id);

    // Estudiantes matriculados en esos grados
    const estudiantesMatriculados = await Matricula.find({
      sede,
      academic_year: academic_year._id,
      docente: docenteId,
    });

    res.json({
      ok: true,
      docente: docenteId,
      materias: materiasAsignadas.map(m => ({
        _id: m._id,
        nombre: m.nombre,
        brand_color: m.brand_color,
        descripcion: m.descripcion,
        grado: m.grado,
      })),
      resumen: {
        totalMateriasAsignadas: materiaIds.length,
        totalEstudiantesMatriculados: estudiantesMatriculados.length,
      },
    });
  } catch (error) {
    console.error("Error al obtener el reporte del docente titular:", error);
    res.status(500).json({
      ok: false,
      msg: "Error interno al generar el reporte.",
    });
  }
};


const getAllReportMatriculas = async (req, res = response) => {
  try {
    const { academicYear, tipo, termino, sede } = req.query;

    const query = {};

    if (academicYear && academicYear !== "general") {
      query.academic_year = academicYear;
    }

    if (sede && sede !== "general") {
      query.sede = sede;
    }

    // Si se quiere buscar por código de matrícula
    if (tipo === "codigo" && termino) {
      query.codigo = { $regex: new RegExp(termino, "i") };
    }

    // Cargar matrículas con relaciones
    const matriculas = await Matricula.find(query)
      .populate({
        path: "estudiante",
        select: "dni nombres apellidos",
        // Solo aplicar filtro si NO es búsqueda por código
        match:
          tipo && tipo !== "codigo" && termino
            ? {
                [tipo]: { $regex: new RegExp(termino, "i") },
              }
            : {},
      })
      .populate({
        path: "grado",
        select: "nombre nivel docente_titular",
        populate: {
          path: "docente_titular",
          select: "nombre",
        },
      })
      .populate("sede", "nombre codigoDane")
      .populate("academic_year", "year periodo")
      .sort({ createdAt: -1 })
      .lean();

    // Filtrar solo las matrículas con estudiante válido
    const filtradas = matriculas.filter((m) => m.estudiante);

    res.json(filtradas);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los datos",
    });
  }
};

module.exports = {
  getAllReporte,
  getAllReportMatriculas,
  getAllReportAdminBySede,
  getAllReportDocenteTitularBySede,
  getAllReportDocenteBySede,
};
