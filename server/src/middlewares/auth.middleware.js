import jwt from "jsonwebtoken";
import { tokenVerify } from "../config/jwt.js";
import userModel from "../models/user.model.js";

export const authMiddeware = async (req, res, next) => {
    try {
        const header = req.headers['authorization'];

        if(!header) {
            return res.status(400).json({message: "Token não fornecido"});
        };
        
        const token = header
        const decode = tokenVerify(token);

        if(!decode) {
            return res.status(400).json({message: "Token Inválido", error: err.message});
        };

        const user = await userModel.findById({_id: decode._id});

        req.user = user;

        next();
    }catch (err) {
        res.status(401).json({message: "Token Inválido"});
    };
}; 