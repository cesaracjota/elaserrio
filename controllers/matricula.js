const { response } = require("express");

const Matricula = require("../models/matricula");
const Estudiante = require("../models/estudiante");
const Materia = require("../models/materia");
const Notas = require("../models/nota");
const AcademicYear = require("../models/academic_year");

const getMatriculas = async (req, res = response) => {
  try {
    const desde = Math.max(0, Number(req.query.desde) || 0);
    const hasta = Math.max(0, Number(req.query.hasta) || 10);
    const idSede = req.query.id;
    const activeAcademicYear = await AcademicYear.findOne({ isActive: true });

    if (hasta <= 0 || desde >= hasta) {
      return res.json({
        matriculas: [],
        total: 0,
      });
    }

    const limite = hasta - desde;

    const [matriculas, total] = await Promise.all([
      Matricula.find({ sede: idSede, academic_year: activeAcademicYear?._id })
        .populate("academic_year")
        .populate("sede")
        .populate({
          path: "grado",
          select: "nombre nivel docente_titular", // Campos del grado
          populate: {
            path: "docente_titular",
            select: "nombre",
          },
        })
        .populate("estudiante")
        .sort({ updatedAt: -1 })
        .skip(desde)
        .limit(limite)
        .lean(),
      Matricula.countDocuments(),
    ]);

    res.json({
      matriculas,
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

const getMatricula = async (req, res = response) => {
  try {
    const matricula = await Matricula.findById(req.params.id).populate(
      "grado academic_year estudiante"
    );

    if (!matricula) {
      return res.status(404).json({
        ok: false,
        msg: "Registro no encontrado",
      });
    }

    res.json(matricula);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// obtener los estudiantes por grados
const getMatriculasByGrado = async (req, res = response) => {
  try {
    const { gradoId } = req.params;
    const activeAcademicYear = await AcademicYear.findOne({ isActive: true });

    if (!gradoId) {
      return res.status(400).json({
        ok: false,
        msg: "Debe proporcionar un grado específico",
      });
    }

    const [matriculas, total] = await Promise.all([
      Matricula.find({ grado: gradoId, academic_year: activeAcademicYear?._id }) // Filtramos por grado
        .populate("academic_year")
        .populate("grado")
        .populate("estudiante")
        .sort({ updatedAt: -1 })
        .lean(),
      Matricula.countDocuments({ grado: gradoId }), // Contamos solo las matriculas del grado
    ]);

    res.json({
      matriculas,
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

const getEstudiantesByMateria = async (req, res = response) => {
  try {
    const { materiaId } = req.params;
    const activeAcademicYear = await AcademicYear.findOne({ isActive: true });

    // Validar el ID de la materia
    if (!materiaId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "ID de materia inválido",
      });
    }

    // Buscar la materia y obtener el grado asociado
    const materia = await Materia.findById(materiaId).populate("grado");
    if (!materia) {
      return res.status(404).json({
        success: false,
        error: "Materia no encontrada",
      });
    }

    // Buscar estudiantes matriculados en el grado de la materia
    const matriculas = await Matricula.find({
      grado: materia.grado._id,
      academic_year: activeAcademicYear?._id,
    }).populate("estudiante grado");

    if (matriculas.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontraron estudiantes matriculados en esta materia",
      });
    }

    res.status(200).json(matriculas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error del servidor",
    });
  }
};

const registrarMatricula = async (req, res = response) => {
  try {
    const { estudiante } = req.body;

    const activeAcademicYear = await AcademicYear.findOne({ isActive: true });

    const matriculaExistente = await Matricula.findOne({
      estudiante,
      academic_year: activeAcademicYear?._id,
    }).lean();

    if (matriculaExistente) {
      return res.status(400).json({
        ok: false,
        msg: `El estudiante ya está matriculado en este año académico`,
      });
    }

    if (!activeAcademicYear) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron años académicos activos",
      });
    }

    const anio = activeAcademicYear?.year?.toString().padStart(4, "0");
    const prefijo = `M${anio}-`;

    let codigoUnico;
    let intento = 0;

    do {
      // 2. Generar número aleatorio de 4 dígitos (puedes cambiar a más si prefieres)
      const numero = Math.floor(1000 + Math.random() * 9000); // entre 1000 y 9999
      codigoUnico = `${prefijo}${numero}`;

      // 3. Verificar que no exista ya en la base de datos
      const existe = await Matricula.exists({ codigo: codigoUnico });
      if (!existe) break;

      intento++;
      if (intento > 10) throw new Error("No se pudo generar un código único");
    } while (true);

    // Crear la nueva matrícula
    const matricula = new Matricula({
      ...req.body,
      codigo: codigoUnico,
      academic_year: activeAcademicYear?._id,
    });

    // Guardar la matrícula en la base de datos
    await matricula.save();

    // Poblar las relaciones para devolver una respuesta completa
    const matriculaPopulada = await Matricula.findById(matricula._id)
      .populate("academic_year")
      .populate("estudiante")
      .populate("grado");

    res.status(201).json({
      ok: true,
      matricula: matriculaPopulada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarMatricula = async (req, res = response) => {
  const id = req.params.id;

  try {
    const matriculaDB = await Matricula.findById(id);

    if (!matriculaDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un estudiante con ese id",
      });
    }

    const cambiosMatricula = { ...req.body };

    const matriculaActualizado = await Matricula.findByIdAndUpdate(
      id,
      cambiosMatricula,
      { new: true }
    )
      .populate("academic_year")
      .populate("estudiante")
      .populate("grado");

    res.json({
      ok: true,
      matricula: matriculaActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarPromediosYRanking = async (req, res = response) => {
  const idGrado = req.params.idGrado;
  const activeAcademicYear = await AcademicYear.findOne({ isActive: true });

  try {
    // Paso 1: Obtener todas las matrículas del grado
    let matriculas = await Matricula.find({
      grado: idGrado,
      academic_year: activeAcademicYear?._id,
    });

    if (matriculas.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron matrículas para este grado",
      });
    }

    // Paso 2: Calcular promedio individual para cada matrícula
    for (const matricula of matriculas) {
      const notas = await Notas.find({ matricula: matricula._id });

      if (notas.length === 0) continue; // si no tiene notas, omitir

      const suma = notas.reduce(
        (total, nota) => total + (nota.promedio || 0),
        0
      );

      const promedioIndividual = suma / notas.length;

      matricula.promedioGeneral = promedioIndividual;
      await matricula.save();
    }

    // Paso 3: Volver a obtener las matrículas con sus relaciones
    matriculas = await Matricula.find({ grado: idGrado })
      .populate("estudiante")
      .populate("grado")
      .populate("academic_year");

    // Paso 4: Ordenar por promedioGeneral
    matriculas.sort((a, b) => b.promedioGeneral - a.promedioGeneral);

    // Paso 5: Asignar ranking
    for (let i = 0; i < matriculas.length; i++) {
      const matricula = matriculas[i];
      matricula.ranking = i + 1;
      await matricula.save();
    }

    // Paso 6: Respuesta final
    return res.json(matriculas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarMatricula = async (req, res = response) => {
  try {
    const { id } = req.params;

    const matricula = await Matricula.findByIdAndDelete(id);

    res.json({
      ok: true,
      matricula,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const searchStudent = async (req, res = response) => {
  try {
    const { search } = req.params;

    const regex = new RegExp(search, "i");

    const estudiantes = await Estudiante.find({
      $or: [{ nombres: regex }, { apellidos: regex }, { dni: regex }],
    }).populate("grado", "nombre descripcion estado createdAt updatedAt");

    res.json(estudiantes);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getMatriculas,
  getMatricula,
  getMatriculasByGrado,
  getEstudiantesByMateria,
  registrarMatricula,
  actualizarMatricula,
  actualizarPromediosYRanking,
  eliminarMatricula,
  searchStudent,
};
