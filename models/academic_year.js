const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true },
  startDate: { type: Date },
  endDate: { type: Date },
  periodo: { type: String, enum: ['1', '2', '3', '4'], required: true },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

// Índice para mejorar consultas del año activo
academicYearSchema.index({ isActive: 1 });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
