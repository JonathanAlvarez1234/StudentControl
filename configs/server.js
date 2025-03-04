'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from "../src/users/user.routes.js"
import cursosRoutes from "../src/cursos/cursos.routes.js"

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
        app.use("/studentControl/v1/auth", authRoutes);
        app.use("/studentControl/v1/users", userRoutes);
        app.use("/studentControl/v1/cursos", cursosRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Successful connection to the database");
    } catch (error) {
        console.log("Error connecting to the database", error);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3001;
    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}