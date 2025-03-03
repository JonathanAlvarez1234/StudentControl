import User from "../users/user.model.js";
import Course from "../cursos/cursos.model.js";

export const saveCourse = async (req, res) =>{
    try {
        const data = req.body;
        const user = await User.findOne({email: data.email});
        if(!user){
            return res.status(400).json({
                success: false,
                msg: "Curso no encontrado"
            })
        }
        const course = new Course({
            ...data,
            keeper: user._id
        });
        await course.save();
        res.status(200).json({
            success: true,
            msg: "Curso creado",
            course
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al guardar el curso",
            error
        })
    }
}

export const getCourse = async(req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {state: true};
    try {
        const courses = await Course.find(query)
            .skip(Number(desde))
            .limit(Number(limite));
        if (!courses.length) {
            return res.status(404).json({
                success: false,
                msg: "No se encontraron cursos"
            });
        }
        const total = await Course.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            courses
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error obteniendo el curso",
            error
        })
    }
}

export const updateCourse = async(req, res = response) => {
    try {
        const {id} = req.params;
        const { _id, keeper, ...data } = req.body;     
        const course = await Course.findByIdAndUpdate(id, data, {new: true});
        res.status(200).json({
            success: true,
            msg: "Curso actualizado",
            course
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el curso",
            error
        })
    }
}

export const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findByIdAndUpdate(id, { state: false }, { new: true });
        if (!course) {
            return res.status(404).json({
                success: false,
                msg: "Curso no encontrado"
            });
        }
        res.status(200).json({
            success: true,
            msg: "Curso eliminado",
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar el curso",
            error
        });
    }
};

export const assignCourseStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                msg: "Alumno no encontrado"
            });
        }
        if (student.role !== "STUDENT_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solo los alumnos pueden ser asignados a cursos"
            });
        }
        if (student.cursos.includes(courseId)) {
            return res.status(400).json({
                success: false,
                msg: "El alumno ya está inscrito en este curso"
            });
        }
        if (student.cursos.length >= 3) {
            return res.status(400).json({
                success: false,
                msg: "El alumno no puede ser asignado a mas de 3 cursos"
            });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                msg: "Curso no encontrado"
            });
        }
        student.cursos.push(courseId);
        await student.save();
        if (!course.students.includes(studentId)) {
            course.students.push(studentId);
            await course.save();
        }
        res.status(200).json({
            success: true,
            msg: "Se asigno el curso al alumno",
            student,
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al asignar el curso",
            error
        });
    }
};