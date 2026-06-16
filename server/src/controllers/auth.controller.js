import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { tokenGenerate } from "../config/jwt.js";
import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log({
            name: name,
            email: email,
            password: password
        });

        if (!name || !email || !password) {
            return res.status(400).json({message: "name, email e password são campos obrigatórios!"});
        };

        // Verifica se usuário existe no banco de dados
        const userExists = await userModel.findOne({emai: email});

        if(userExists) {
            return res.status(400).json({message: "Email já cadastrado!"});
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({message: "Usuário criado", user: user});

    }catch (err) {
        res.status(500).json({message: "Erro ao criar usuário", error: err.message});
    };
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log({
            email: email,
            password: password
        })
        if (!email || !password) {
            return res.status(400).json({message: "email e password são campos obrigatórios!"});
        };
        
        const user = await userModel.findOne({email: email}).select("+password");

        if(!user) {
            return res.status(400).json({message: "Credenciais Inválidas!"});
        };

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if(!passwordIsValid) {
            return res.status(400).json({message: "Credenciais Inválidas!"});
        };

        const token = tokenGenerate({
            _id: user._id
        });

        return res.status(200).json({message: "Usuário logado", token: token});
        
    } catch (err) {
        return res.status(500).json({message: "Erro ao fazer login", error: err.message});
    };
};

export const updateUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        if(!user) {
            return res.status(404).json({message: "Usuário não encontrado!"});
        };

        console.log(`Usuário ${user.name} deletado`)

        return res.status(200).json({message: "Usuário atualizado", user: user});
    }catch (err) {
        return res.status(500).json({message: "Erro ao atualizar perfil", error: err.message});
    }
};

export const deleteIdUser = async (req, res) => {
    try{
        const user = await userModel.findByIdAndDelete(req.user._id);
        
        if(!user)
            return res.status(404).json({message: "Usuário não encontrado!"});
        
        await categoryModel.deleteMany({user: req.user._id});
        await transactionModel.deleteMany({user: req.user._id});

        console.log(`Usuário ${user.name} deletado`)
        
        return res.status(200).json({ message: "Usuário deletado!" });
    }catch(err) {
        return res.status(500).json({message: "Erro ao deletar usuário", error: err.message});
    };
};