import { Router } from "express";
import { check } from "express-validator";
import {saveCourse, getCourse, searchCourse, deleteCourse, updateCourse} from "./cursos.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js";
import {validarJWT} from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("email", "Este no es un correo válido").not().isEmpty(),
        validarCampos
    ],
    saveCourse
)

router.post("/assign-course", assignCourseToStudent);

router.get("/", getCourse)

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    searchCourse
)

router.put(
    "/:id",
    [
        validarCampos
    ],
    updateCourse
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    deleteCourse
)

export default router;