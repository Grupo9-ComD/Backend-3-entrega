import express from "express";
import Mensaje from "../models/message.model.js";

const router = express.Router();

router.get("/messages", async (req, res) => {
    try {
        // 1. Trae los últimos 30 mensajes (ordenados de más nuevo a más viejo)
        const messages = await Mensaje.find()
            .sort({ createdAt: -1 })
            .limit(30);

        // 2. Usamos .reverse() para ordenarlos correctamente (del más viejo al más nuevo)
        // 3. Mapeamos incluyendo 'createdAt'
        const formatted = messages.reverse().map(m => ({
            usuario: m.nombre,
            contenido: m.contenido,
            createdAt: m.createdAt // <-- ¡ESTO SOLUCIONA LA FECHA!
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        res.status(500).json({ error: "Error al cargar mensajes" });
    }
});



export default router;