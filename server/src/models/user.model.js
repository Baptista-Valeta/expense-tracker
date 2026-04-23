import mongoose from 'mongoose'
import bcrypt from "bcrypt"  // usado para encriptar passwords e comparar passwords para login;

const Users = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true // remove espaços antes/depois
    },
    email: {
        type: String,
        require: true,
        unique: true,  // não permite emails duplicados
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        select: false // não retorna a senha nas consultas
    },
    // Tipo de usuário
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true // cria createdAt e updatedAt automaticamente
});

export default mongoose.model("Users", Users);