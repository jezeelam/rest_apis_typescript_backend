import express from "express";
import colors from "colors"
import cors, { CorsOptions } from "cors"
import swaggerUI from 'swagger-ui-express'
import swaggerSpec from "./config/swagger";
import router from "./router";
import db from "./config/db";
import morgan from "morgan";

// Conectar BD
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.bgGreen("Conexion exitosa a la BD"));
        
    } catch (error) {
        console.log(error);
        console.log(colors.bgRed.white("Hubo un error en la base de datos"));
        
    }
}
connectDB()

const server = express()

// Permitir conexiones CORS
const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true)   
        } else {
            callback(new Error('Error de CORS'))
            console.log(origin);
            
        }
    }
}
server.use(cors(corsOptions))
// Leer Datos de formularios
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

export default server