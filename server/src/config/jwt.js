import jwt from "jsonwebtoken";


export const tokenGenerate = (payload) => {    
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

export const tokenVerify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}
