'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from "../src/users/user.routes.js"
import cursosRoutes from "../src/cursos/cursos.controller.js"

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const configurarRutas = (app) =>{
        app.use("/StudentControl/v1/auth", authRoutes);
        app.use("/StudentControl/v1/users", userRoutes);
        app.use("/StudentControl/v1/cursos", cursosRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexion exitosa con la Base de Datos");
    } catch (error) {
        console.log("Error al conectar con la Base de Datos", error);
    }
}

export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3001;

    await conectarDB();
    configurarMiddlewares(app);
    configurarRutas(app);

    app.listen(port, () => {
        console.log(`Server Running On Port ${port}`);
    });
}