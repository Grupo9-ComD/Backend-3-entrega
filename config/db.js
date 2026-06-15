import mongoose from "mongoose";
import dns from "dns";

// Forzar DNS de Google para resolver registros SRV de MongoDB Atlas
// (soluciona ECONNREFUSED en ciertos entornos de red)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const conectarDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        
        const connection = await mongoose.connect(uri);
        console.log(`🔌 Conectado a MongoDB Atlas exitosamente: ${connection.connection.host}`);
    } catch (error) {
        console.error(`❌ Error al conectar a MongoDB: ${error.message}`);
        process.exit(1); 
    }
};

export default conectarDB;