import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15*60*1000, //15mnts
    max: 100,
    message:{
        succes: false,
        msg: "Demasiadas peticiones de esta IP, intentelo más tarde."
    }
})

export default limiter;