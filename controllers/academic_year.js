const { response } = require("express");
const AcademicYear = require("../models/academic_year");

const getAcademicsYear = async (req, res = response) => {
  try {
    const academic_year = await AcademicYear.find().sort({ updatedAt: -1 });

    res.json(academic_year);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getActiveAcademicsYear = async (req, res = response) => {
  try {
    const academic_year = await AcademicYear.findOne({ isActive: true });

    if (!academic_year) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron años académicos activos",
      });
    }

    res.json(academic_year);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getAcademicYear = async (req, res = response) => {
  try {
    const academic_year = await AcademicYear.findById(req.params.id);

    if (!academic_year) {
      return res.status(404).json({
        ok: false,
        msg: "Año academico no encontrado",
      });
    }

    res.json(academic_year);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const registerAcademicYear = async (req, res = response) => {
  try {
    const { year, startDate, endDate, periodo, isActive } = req.body;

    const academicYearDB = await AcademicYear.findOne({ year });

    if (academicYearDB) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe con ese nombre",
      });
    }

    if (isActive) {
      const activeYear = await AcademicYear.findOne({ isActive: true });
      if (activeYear) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un registro activo. Solo puede haber un registro activo a la vez.",
        });
      }
    }

    const data = {
      year,
      startDate,
      endDate,
      periodo,
      isActive,
    };

    const academic_year = new AcademicYear(data);

    await academic_year.save();

    res.status(201).json(academic_year);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateAcademicYear = async (req, res = response) => {
  try {
    const { year, startDate, endDate, periodo, isActive } = req.body;
    const id = req.params.id;

    const data = {
      year,
      startDate,
      endDate,
      periodo,
      isActive,
    };

    // Si se desea activar este registro
    if (isActive) {
      // Verifica si hay otro registro activo distinto al que se está actualizando
      const activeYear = await AcademicYear.findOne({
        isActive: true,
        _id: { $ne: id }, // diferente al actual
      });

      if (activeYear) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un año académico activo. Desactívelo antes de activar otro.",
        });
      }
    }

    const academic_year = await AcademicYear.findByIdAndUpdate(id, data, { new: true });

    if (!academic_year) {
      return res.status(404).json({
        ok: false,
        msg: "Año académico no encontrado.",
      });
    }

    res.json(academic_year);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};


const deleteAcademicYear = async (req, res = response) => {
  try {
    const { id } = req.params;

    const academic_year = await AcademicYear.findById(id);

    if (!academic_year) {
      return res.status(404).json({
        ok: false,
        msg: "El dato no existe",
      });
    }

    const academic_yearDB = await AcademicYear.findByIdAndDelete(id);

    res.json(academic_yearDB);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getAcademicsYear,
  getAcademicYear,
  getActiveAcademicsYear,
  registerAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};
