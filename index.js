const { dbConnection } = require('./database/config');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// MIDLEWARES

// Medir tiempo de respuesta por endpoint
app.use((req, res, next) => {
  const inicio = Date.now();
  res.on('finish', () => {
    const tiempo = Date.now() - inicio;
    console.log(`⏱️ [${req.method}] ${req.originalUrl} - ${res.statusCode} - ${tiempo}ms`);
  });
  next();
});

// Configurar COR
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ extended: false, limit: '50mb' }));

// Rutas
app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});

app.use('/api/login', require('./routes/auth'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/grados', require('./routes/grados'));
// app.use('/api/tipos_activo', require('./routes/tipos_activo'));
// app.use('/api/activos', require('./routes/activos'));
// app.use('/api/categoria_uniforme', require('./routes/categoria_uniforme'));
// app.use('/api/uniformes', require('./routes/uniformes'));
app.use('/api/docentes', require('./routes/docentes'));
app.use('/api/estudiantes', require('./routes/estudiantes'));
// app.use('/api/pagos', require('./routes/pagos'));
// app.use('/api/concepto_pago', require('./routes/concepto_pago'));
app.use('/api/reportes', require('./routes/reportes'));
app.use('/api/email', require('./routes/sendEmailRoutes'));
app.use('/api/academic_year', require('./routes/academic_year'));
app.use('/api/matriculas', require('./routes/matriculas'));
// app.use('/api/egresos', require('./routes/egresos'));
// app.use('/api/tramites', require('./routes/tramites'));
app.use('/api/sedes', require('./routes/sedes'));
// app.use('/api/roles', require('./routes/roles'));
// app.use('/api/modulos', require('./routes/modulos'));
app.use('/api/materias', require('./routes/materias'));
app.use('/api/notas', require('./routes/notas'));
app.use('/api/configuraciones', require('./routes/configuraciones'));
app.use('/api/accesos', require('./routes/acceso'));

app.listen(process.env.PORT, () => {
    console.log('Server is running on port http://localhost:' + process.env.PORT);
});