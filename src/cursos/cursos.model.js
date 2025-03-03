import {Schema, model} from "mongoose";

const CursosSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    keeper:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    description: {
        type: String,
        required: [true, "La descripción es necesaria"]
    },
    students: { 
        type: Schema.Types.ObjectId, 
        ref: "user" 
    },
    state: {
        type: Boolean,
        default: true
    }
});

CursosSchema.methods.toJSON = function() {
    const {__v,password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model("Course", CursosSchema);