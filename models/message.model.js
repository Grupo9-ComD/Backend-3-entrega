import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    nombre: String,
    contenido: String
}, {
    timestamps: true
});

export default mongoose.model("Mensaje", mensajeSchema);