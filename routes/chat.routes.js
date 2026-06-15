import express from "express";
import Mensaje from "../models/message.model.js";

const router = express.Router();

router.get("/messages", async (req, res) => {
    try {
        const messages = await Mensaje.find()
            .sort({ createdAt: -1 })
            .limit(30);

         const formatted = messages.reverse().map(m => ({
            usuario: m.nombre,
            contenido: m.contenido,
            createdAt: m.createdAt
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        res.status(500).json({ error: "Error al cargar mensajes" });
    }
});



export default router;