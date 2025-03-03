import { hash, verify } from "argon2";
import Usuario from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const register  = async (req, res) => {
    try {
        const data = req.body;
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash(data.password);
        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role,
            profilePicture
        })
        return res.status(201).json({
            msg: "Usuario registrado",
            userDetails:{
                user: user.email
            }
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Registro fallido",
            error: error.msg
        })
    }
}

export const login = async (req, res) => {
    const {email,password, username} = req.body;
    try {
        const user = await Usuario.findOne({
            $or: [{email},{username}]
        })
        if(!user){
            return res.status(400).json({
                msg: "Datos incorrectos, el correo no existe en la base de datos"
            });
        }
        if(!user.state){
            return res.status(400).json({
                msg: "El usuario no existe en la base de datos"
            }); 
        }
        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: "Contraseña incorrecta"
            })
        }
        const token = await generarJWT(user.id);
        res.status(200).json({
            msg: "Sesión iniciada exitosamente",
            userDetails: {
                username: user.username,
                token: token,
                profilePicture: user.profilePicture
            }
        })
    } catch (error) {
        console.log(e);
        res.status(500).json({
            msg: 'Error del servidor',
            error: e.msg
        })
    }
}
