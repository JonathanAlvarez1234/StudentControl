import User from "../users/user.model.js";
import Course from "../cursos/cursos.model.js";

export const saveCourse = async (req, res) =>{
    try {
        const data = req.body;
        const user = await User.findOne({email: data.email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Curso no encontrado"
            })
        }

        const course = new Course({
            ...data,
            keeper: user._id
        });

        await course.save();

        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al guardar el curso",
            error
        })
    }
}

export const asignarCursoEstudiante = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Estudiante no encontrado"
            });
        }

        if (student.role !== "STUDENT_ROLE") {
            return res.status(403).json({
                success: false,
                message: "Solo los estudiantes pueden ser asignados a cursos"
            });
        }

        if (student.cursos.length >= 3) {
            return res.status(400).json({
                success: false,
                message: "El no puede ser asignado a más de 3 cursos"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
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
            message: "Curso asignado al estudiante",
            student,
            course
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al asignar el curso",
            error
        });
    }
};

export const getCourse = async(req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {status: true};
    try {
        const courses = await Course.find(query)
            .skip(Number(desde))
            .limit(Number(limite));
            
        const coursesWithOwnerNames =  await Promise.all(courses.map(async (course) =>{
            const owner = await User.findById(course.keeper);
            return{
                ...course.toObject(),
                keeper: owner ? owner.nombre: "Maestro no encontrado"
            }
        }));
        
        const total = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            courses: coursesWithOwnerNames
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el curso",
            error
        })
    }
}

export const searchCourse = async (req, res) =>{
    const {id} = req.params;

    try {
        const course = await Course.findById(id);

        if(!course){
            return res.status(404)({
                success: false,
                message: "Curso no encontrado"
            })
        }

        const owner = await User.findById(course.keeper);

        res.status(200).json({
            success: true,
            course: {
                ...course.toObject(),
                keeper: owner ? owner.nombre : "Maestro no encontrado"
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar el curso",
            error
        })
    }
}

export const deleteCourse = async(req, res) => {

    const {id} = req.params;

    try {
        await Course.findByIdAndUpdate(id, {status: false});
        
        res.status(200).json({
            success: true,
            message: "Curso eliminado exitosamete!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al desactivar el curso",
            error
        })
    }

}

export const updateCourse = async(req, res = response) => {
    try {

        const {id} = req.params;
        const { _id, keeper, ...data } = req.body;
                
        const course = await Pet.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: "Curso actualizado!",
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