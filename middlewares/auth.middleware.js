import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
    let token = req.cookies ? req.cookies.jwt_token : null;

    if (!token) {
        const authHeader = req.header("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

    const esApiRequest = req.header("Authorization") || 
                         (req.header("Accept") && req.header("Accept").includes("application/json")) ||
                         req.header("Content-Type") === "application/json";

    if (!token) {
        if (esApiRequest) {
            return res.status(401).json({ error: "Acceso denegado. No se proporcionó un token de autenticación." });
        }
        return res.redirect("/usuarios/login-vista");
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;
        
        next(); 
    } catch (error) {
        if (esApiRequest) {
            return res.status(401).json({ error: "Token inválido o expirado. Volvé a iniciar sesión." });
        }
        res.redirect("/usuarios/login-vista");
    }
};

export default verificarToken;
