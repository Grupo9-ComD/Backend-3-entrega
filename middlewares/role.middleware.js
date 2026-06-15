const verificarRol = (rolesPermitidos) => {
    
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: "Usuario no autenticado." });
        }

        if (rolesPermitidos.includes(req.usuario.rol)) {
            next();
        } else {
            res.status(403).json({ 
                error: `Acceso denegado. Esta acción requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}` 
            });
        }
    };
};

export default verificarRol;