import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
    // 1. Intentamos buscar el token en las cookies del navegador (Pug)
    let token = req.cookies ? req.cookies.jwt_token : null;

    // 2. Si no hay cookie, intentamos buscarlo en el Header (Thunder Client)
    if (!token) {
        const authHeader = req.header("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

    // Detectar si la petición viene de una API o de una vista web
    const esApiRequest = req.header("Authorization") || 
                         (req.header("Accept") && req.header("Accept").includes("application/json")) ||
                         req.header("Content-Type") === "application/json";

    // 3. Si definitivamente no hay token en ningún lado
    if (!token) {
        if (esApiRequest) {
            // Para clientes API: devolver 401 JSON en vez de redirigir
            return res.status(401).json({ error: "Acceso denegado. No se proporcionó un token de autenticación." });
        }
        // Para vistas web: redirigir al login
        return res.redirect("/usuarios/login-vista");
    }

    try {
        // 4. Verificamos que el token sea válido y no esté vencido
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;
        
        // 5. Dejamos que pase a la ruta correspondiente
        next(); 
    } catch (error) {
        if (esApiRequest) {
            // Token inválido/expirado para API → 401 JSON
            return res.status(401).json({ error: "Token inválido o expirado. Volvé a iniciar sesión." });
        }
        // Token inválido/expirado para vista → redirigir al login
        res.redirect("/usuarios/login-vista");
    }
};

export default verificarToken;
