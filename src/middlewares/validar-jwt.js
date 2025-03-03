import jwt from 'jsonwebtoken';
import Usuario from "../users/user.model.js";

export const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            success: false,
            msg: "No hay un token en la petición"
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                success: false,
                msg: "El usuario no existe en la base de datos"
            });
        }
        if (!usuario.state) {
            return res.status(401).json({
                success: false,
                msg: "Token no válido, usuario con estado: False"
            });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.error("Error en la validación del JWT:", error);
        res.status(401).json({
            success: false,
            msg: "Token no válido"
        });
    }
};