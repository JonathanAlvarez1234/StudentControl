import { Router } from "express";
import { check } from "express-validator";
import { saveCourse, getCourse, assignCourseStudent, deleteCourse, updateCourse } from "./cursos.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getCourse)

router.post(
    "/",
    [
        validarJWT,
        check("email", "Este no es un correo válido").not().isEmpty(),
        validarCampos
    ],
    saveCourse
)

router.post(
    "/assignCourse/",
    [
        validarJWT
    ],
    assignCourseStudent);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
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