
import Usuario from "../users/user.model.js";

export const validarJWT = async(req, res, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: "No hay un token en la petición"
        })
    }

    try{
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const usuario = await Usuario.findById(uid)

        if(!usuario){
            return res.status(401).json({
                msg:"Usuario no existente en la base de datos"
            })
        }

        if(!usuario.state){
            return res.status(401).json({
                msg: "Token no válido, usuario con estado: False"
            })
        }

        req.usuario = usuario;

        next();
    }catch(e){
        console.log(e);
        res.status(401).json({
            msg: "Token no válido"
        })
    }
    
}