const Nota = require("../models/nota"); 
const mongoose = require("mongoose");

/**
 * Crear una nueva nota
 */

const upsertNota = async (req, res) => {
  try {
    const {
      matricula,
      materia,
      profesor,
      bimestre1,
      bimestre2,
      bimestre3,
      bimestre4,
      fallas,
      indicadores,
      valoraciones,
      promedio,
      estado,
      observaciones,
    } = req.body;

    // El problema está aquí - solo estás actualizando "profesor" pero buscando por todos
    const notaActualizada = await Nota.findOneAndUpdate(
      { matricula, materia }, // Quita "profesor" del filtro
      {
        matricula,
        materia,
        profesor,
        bimestre1,
        bimestre2,
        bimestre3,
        bimestre4,
        fallas,
        indicadores,
        valoraciones,
        promedio,
        estado,
        observaciones,
      }, // Actualiza todos los campos
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!notaActualizada) {
      return res
        .status(404)
        .json({ message: "No se pudo crear/actualizar la nota" });
    }

    return res.status(200).json(notaActualizada);
  } catch (error) {
    console.error("Error en upsertNota:", error);
    return res.status(500).json({
      message: "Error al procesar la nota",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

/**
 * ACTUALIZAR RANKING POR MATERIA
 * @param {*} materiaId 
 */

const actualizarRankingPorMateria = async (req, res) => {
  try {
    const { materiaId } = req.params;

    if (!materiaId || !mongoose.Types.ObjectId.isValid(materiaId)) {
      return res.status(400).json({ message: "ID de materia inválido" });
    }

    // Asegurarse de que sea un ObjectId para comparación precisa
    const estudiantes = await Nota.find({ materia: new mongoose.Types.ObjectId(materiaId) });

    if (!estudiantes || !Array.isArray(estudiantes) || estudiantes.length === 0) {
      return res.status(404).json({ message: "No se encontraron estudiantes para esta materia" });
    }
    
    // Ordenar por promedio (mayor a menor)
    estudiantes.sort((a, b) => b.promedio - a.promedio);

    // Asignar ranking y guardar
    for (let i = 0; i < estudiantes.length; i++) {
      const nota = estudiantes[i];
      nota.ranking = i + 1;
      await nota.save();
    }

    return res.status(200).json(estudiantes);

  } catch (error) {
    console.error("❌ Error al actualizar el ranking:", error);
    return res.status(500).json({ message: "Error interno al actualizar el ranking", error: error.message });
  }
};

/**
 * Obtener todas las notas
 */
const obtenerNotas = async (req, res) => {
  try {
    const notas = await Nota.find().populate(
      "matricula materia profesor",
      "nombre apellido"
    );
    res.status(200).json(notas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las notas", error: error.message });
  }
};

/**
 * Obtener notas por matrícula (estudiante)
 */
const obtenerNotasPorMatriculayMateria = async (req, res) => {
  try {
    const { matriculaId, materiaId } = req.params;
    const nota = await Nota.findOne({
      matricula: matriculaId,
      materia: materiaId,
    }).populate("matricula", "nombre apellido");
    res.status(200).json(nota);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las notas", error: error.message });
  }
};

const obtenerNotasPorMateria = async (req, res) => {
  try {
    const { materiaId } = req.params;
    const notas = await Nota.find({ materia: materiaId }).populate([
      {
        path: "matricula",
        populate: {
          path: "estudiante academic_year",
        },
      },
      {
        path: "materia",
        select: "nombre",
        populate: {
          path: "grado",
          select: "nombre",
        },
      },
      {
        path: "profesor",
        select: "nombre apellidos",
      },
    ]);
    res.status(200).json(notas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las notas", error: error.message });
  }
};

const obtenerNotasPorEstudiante = async (req, res) => {
  try {
    const { matriculaId } = req.params;

    const notas = await Nota.find({ matricula: matriculaId })
      .populate([
        {
          path: "materia",
          populate: {
            path: "grado",
            select: "nombre nivel docente_titular", // Campos del grado
            populate: {
              path: "docente_titular",
              select: "nombre"
            }
          },
        },
        {
          path: "profesor",
          select: "nombre apellidos email", // Info del profesor
        },
        {
          path: "matricula",
          populate: [
            {
              path: "estudiante",
              select: "nombres apellidos dni", // Info completa del estudiante
            },
            {
              path: "academic_year",
              select: "year periodo fecha_inicio fecha_fin", // Info del año académico
            },
          ],
        },
      ])
      .sort({ "materia.nombre": 1 }); // Ordenar alfabéticamente por nombre de materia

    if (notas.length === 0) {
      return res.status(404).json({
        message: "No se encontraron notas para esta matrícula",
        suggestion:
          "Verifique que el ID de matrícula es correcto y que el estudiante tiene materias asignadas",
      });
    }

    res.status(200).json(notas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el historial académico del estudiante",
      error: error.message,
      details: {
        endpoint: "/api/notas/estudiante/:matriculaId",
        method: "GET",
      },
    });
  }
};

/**
 * Actualizar una nota y recalcular promedio
 */
const actualizarNota = async (req, res) => {
  try {
    const { id } = req.params;
    const { bimestre1, bimestre2, bimestre3, bimestre4 } = req.body;

    // Buscar y actualizar la nota
    const notaActualizada = await Nota.findByIdAndUpdate(
      id,
      { bimestre1, bimestre2, bimestre3, bimestre4 },
      { new: true }
    );

    if (!notaActualizada) {
      return res.status(404).json({ message: "Nota no encontrada." });
    }

    // Recalcular promedio
    notaActualizada.promedio = (
      (bimestre1 + bimestre2 + bimestre3 + bimestre4) /
      4
    ).toFixed(2);
    await notaActualizada.save();

    res
      .status(200)
      .json({ message: "Nota actualizada con éxito", nota: notaActualizada });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la nota", error: error.message });
  }
};

/**
 * Eliminar (anular) una nota
 */
const eliminarNota = async (req, res) => {
  try {
    const { id } = req.params;

    // Marcar la nota como anulada
    const notaAnulada = await Nota.findByIdAndUpdate(
      id,
      { estado: "anulado" },
      { new: true }
    );

    if (!notaAnulada) {
      return res.status(404).json({ message: "Nota no encontrada." });
    }

    res
      .status(200)
      .json({ message: "Nota anulada correctamente", nota: notaAnulada });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al anular la nota", error: error.message });
  }
};

// Exportar los controladores
module.exports = {
  upsertNota,
  actualizarRankingPorMateria,
  obtenerNotas,
  obtenerNotasPorMatriculayMateria,
  obtenerNotasPorMateria,
  obtenerNotasPorEstudiante,
  actualizarNota,
  eliminarNota,
};
