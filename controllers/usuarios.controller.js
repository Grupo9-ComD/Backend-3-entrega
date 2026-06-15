import Usuario from "../models/usuario.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ==========================================
// RUTAS API REST
// ==========================================
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        usuario ? res.json(usuario) : res.status(404).json({ error: "Usuario no encontrado" });
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { password, ...restoDeDatos } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            ...restoDeDatos,
            password: passwordHash
        });

        await nuevoUsuario.save();

        res.status(201).json(nuevoUsuario);

    } catch (error) {
        res.status(400).json({ error: "Error al crear usuario: " + error.message });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        usuarioActualizado ? res.json(usuarioActualizado) : res.status(404).json({ error: "Usuario no encontrado" });
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar" });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndUpdate(req.params.id, { estado: "Inactivo" }, { new: true });
        usuarioEliminado ? res.json({ mensaje: "Usuario inactivo", usuario: usuarioEliminado }) : res.status(404).json({ error: "No encontrado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
};

// ==========================================
// VISTAS FRONTEND PUG
// ==========================================
const obtenerUsuariosVista = async (req, res) => {
    try {
        const usuarios = await Usuario.find().lean();
        res.render("usuarios/list", { usuarios });
    } catch (error) {
        res.status(500).send("Error");
    }
};

const formularioNuevoUsuario = (req, res) => {
    res.render("usuarios/form");
};

const crearUsuarioVista = async (req, res) => {
    try {
        const { password, ...restoDeDatos } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            ...restoDeDatos,
            password: passwordHash
        });

        await nuevoUsuario.save();

        res.redirect("/usuarios/vista");
    } catch (error) {
        res.status(400).send("Error al crear usuario desde la vista: " + error.message);
    }
};




// GET - Renderiza el formulario de Login
const mostrarLogin = (req, res) => {
    res.render("usuarios/login", { hideHomeLink: true, emailValue: "" });
};

// POST - Procesa el formulario, valida y guarda la Cookie
const procesarLoginVista = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailNormalizado = typeof email === "string" ? email.trim().toLowerCase() : "";

        const usuarioEncontrado = await Usuario.findOne({ email: emailNormalizado });
        if (!usuarioEncontrado) {
            return res.render("usuarios/login", {
                error: "El correo o la clave son incorrectos",
                hideHomeLink: true,
                emailValue: emailNormalizado
            });
        }
        if (!usuarioEncontrado.password) {
            return res.render("usuarios/login", {
                error: "El usuario no tiene una contraseña configurada",
                hideHomeLink: true,
                emailValue: emailNormalizado
            });
        }

        if (usuarioEncontrado.estado !== "Activo") {
            return res.render("usuarios/login", { error: "Tu cuenta se encuentra inactiva. Contactá al administrador.", hideHomeLink: true });
        }

        const passwordValida = await bcrypt.compare(password, usuarioEncontrado.password);
        if (!passwordValida) {
            return res.render("usuarios/login", {
                error: "El correo o la clave son incorrectos",
                hideHomeLink: true,
                emailValue: emailNormalizado
            });
        }

        const token = jwt.sign(
            { id: usuarioEncontrado._id, rol: usuarioEncontrado.rol, nombre: usuarioEncontrado.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.cookie("jwt_token", token, {
            httpOnly: true, 
            maxAge: 2 * 60 * 60 * 1000 // La cookie dura 2 horas (en milisegundos)
        });

    
        res.redirect("/");

    } catch (error) {
        res.render("usuarios/login", {
            error: "Ocurrió un error en el servidor",
            hideHomeLink: true,
            emailValue: typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : ""
        });
    }
};











const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailNormalizado = typeof email === "string" ? email.trim().toLowerCase() : "";

        const usuarioEncontrado = await Usuario.findOne({ email: emailNormalizado });

        if (!usuarioEncontrado) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }
        if (!usuarioEncontrado.password) {
            return res.status(409).json({ error: "El usuario no tiene una contraseña configurada" });
        }

        if (usuarioEncontrado.estado !== "Activo") {
            return res.status(403).json({ error: "Tu cuenta se encuentra inactiva. Contactá al administrador." });
        }

        
        const passwordValida = await bcrypt.compare(password, usuarioEncontrado.password);

        if (!passwordValida) {
            return res.status(401).json({ error: "Credenciales incorrectas" }); // Error 401: No autorizado
        }

        const token = jwt.sign(
            {
                id: usuarioEncontrado._id,
                rol: usuarioEncontrado.rol,
                nombre: usuarioEncontrado.nombre
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } 
        );

        
        res.status(200).json({
            mensaje: "¡Login exitoso!",
            token: token,
            usuario: {
                nombre: usuarioEncontrado.nombre,
                email: usuarioEncontrado.email,
                rol: usuarioEncontrado.rol
            }
        });



    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor al intentar iniciar sesión: " + error.message });
    }
};

const logoutVista = (req, res) => {
    res.clearCookie("jwt_token");
    res.redirect("/usuarios/login-vista");
};

const logoutApi = (req, res) => {
    res.clearCookie("jwt_token");
    res.status(200).json({ mensaje: "Sesión cerrada correctamente. Recuerda eliminar el token de los headers en Thunder Client." });
};

export {
    obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, eliminarUsuario,
    obtenerUsuariosVista, formularioNuevoUsuario, crearUsuarioVista, loginUsuario, mostrarLogin, procesarLoginVista,
    logoutVista, logoutApi
};
