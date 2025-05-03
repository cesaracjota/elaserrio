const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res = response) => {
  try {
    const desde = Math.max(0, Number(req.query.desde) || 0);
    const hasta = Math.max(0, Number(req.query.hasta) || 10);

    if (hasta <= 0 || desde >= hasta) {
      return res.json({ ok: true, usuarios: [], total: 0 });
    }

    const limite = hasta - desde;
    const [usuarios, total] = await Promise.all([
      Usuario.find({}, "nombre correo rol sexo sedes estado img")
        .populate("sedes")
        .sort({ updatedAt: -1 })
        .skip(desde)
        .limit(limite)
        .lean(),
      Usuario.countDocuments(),
    ]);

    res.json({ ok: true, usuarios, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const getAllDocentes = async (req, res = response) => {
  try {
    const { id } = req.params; // ID de la sede a filtrar

    const usuarios = await Usuario.find({
      // docente role y docente titular role
      $or: [{ rol: "DOCENTE_ROLE" }, { rol: "DOCENTE_TITULAR_ROLE" }],
      sedes: { $in: [id] }, // Busca si la sede está en el array
    });

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const getAllDocentesTitulares = async (req, res = response) => {
  try {
    const { id } = req.params; // ID de la sede a filtrar

    const usuarios = await Usuario.find({
      $or: [{ rol: "DOCENTE_TITULAR_ROLE" }],
      sedes: { $in: [id] }, // Busca si la sede está en el array
    });

    res.json(usuarios);

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const getUsuario = async (req, res = response) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    res.json({ ok: true, usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const crearUsuario = async (req, res = response) => {
  try {
    if (await Usuario.findOne({ correo: req.body.correo })) {
      return res.status(400).json({ ok: false, msg: "El correo ya existe" });
    }

    req.body.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync()
    );
    const usuario = new Usuario({
      ...req.body,
      img:
        req.body.sexo === "M"
          ? "https://avatar.iran.liara.run/public/job/teacher/male"
          : "https://avatar.iran.liara.run/public/job/teacher/female",
    });
    await usuario.save();
    const token = await generarJWT(usuario.id);

    res.json({ ok: true, usuario: await usuario.populate("sedes"), token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const actualizarUsuario = async (req, res = response) => {
  try {
    const { id } = req.params;

    const usuarioDB = await Usuario.findById(id);

    if (!usuarioDB) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    if (
      req.body.correo &&
      req.body.correo !== usuarioDB.correo &&
      (await Usuario.findOne({ correo: req.body.correo }))
    ) {
      return res
        .status(400)
        .json({ ok: false, msg: "Ya existe un usuario con ese correo" });
    }

    if (req.body.password) {
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync()
      );
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      {
        ...req.body,
        img:
          req.body.sexo === "M"
            ? "https://avatar.iran.liara.run/public/job/teacher/male"
            : "https://avatar.iran.liara.run/public/job/teacher/female",
      },
      {
        new: true,
      }
    ).populate("sedes");
    res.json({ ok: true, usuario: usuarioActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const cambiarEstadoUsuario = async (req, res = response, estado) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    res.json({ ok: true, usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const inactivarUsuario = (req, res) => cambiarEstadoUsuario(req, res, false);
const activarUsuario = (req, res) => cambiarEstadoUsuario(req, res, true);

const eliminarUsuario = async (req, res = response) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    res.json({ ok: true, msg: "Usuario eliminado", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

module.exports = {
  getUsuarios,
  getAllDocentes,
  getAllDocentesTitulares,
  getUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  inactivarUsuario,
  activarUsuario,
};
