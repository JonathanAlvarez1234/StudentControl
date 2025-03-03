import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    surname: {
        type: String,
        required: [true, "El apellido es necesario"]
    },
    username: {
        type: String,
        required: [true, "El nombre de usuario es necesario"]
    },
    email:{
        type: String,
        required: [true, "El correo es necesario"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es necesario"]
    },
    role: {
        type: String,
        enum: ["TEACHER_ROLE","STUDENT_ROLE"],
        default: "STUDENT_ROLE"
    },
    cursos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course"  
    }],
    state: {
        type: Boolean,
        default: true
    }
});

UserSchema.methods.toJSON = function() {
    const {__v,password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default mongoose.model("User", UserSchema);