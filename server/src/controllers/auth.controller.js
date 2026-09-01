import bcrypt from "bcrypt";

import userModel from "../models/user.model.js";
import { tokenGenerate } from "../config/jwt.js";
import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";

export const registerUser = async (req, res) => {
    try {
        console.log('[POST] /register');

        const { name, email, password, saldo, saldoTotalEntrado, saldoTotalSaido,role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({message: "name, email e password são campos obrigatórios!"});
        };

        // Verifica se usuário existe no banco de dados
        const emailExists = await userModel.findOne({email: email});

        if(emailExists) {
            return res.status(400).json({message: "Email já cadastrado!"});
        };

        console.log('Email ja existente', emailExists)

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            saldo: 0,
            saldoTotalEntrado: 0,
            saldoTotalSaido: 0,
            role
        });

        console.log("Usuário criado");
        return res.status(201).json({user: user});
    }catch (err) {
        console.error('Erro ao registrar.', err.message);
        return res.status(500).json({message: "Erro ao criar usuário", error: err.message});
    };
};

export const loginUser = async (req, res) => {
    try {
        console.log('[POST] /login');

        const { email, password } = req.body;

        console.log({
            email: email,
            password: password
        });
        if (!email || !password) {
            return res.status(400).json({message: "email e password são campos obrigatórios!"});
        };
        
        const user = await userModel.findOne({email: email}).select("+password");

        if(!user) {
            return res.status(400).json({message: "Credenciais Inválidas!"});
        };

        const passwordIsValid = await bcrypt.compare(password, user.password);

        // console.log('Senha válida?', passwordIsValid, password, user.password);
        if(!passwordIsValid) {
            return res.status(400).json({message: "Credenciais Inválidas!"});
        };

        const token = tokenGenerate({
            _id: user._id
        });

        console.log("Usuário logado");
        return res.status(200).json({token: token});
        
    } catch (err) {
        console.error('Erro ao fazer login', err);
        return res.status(500).json({message: "Erro ao fazer login", error: err.message});
    };
};

export const updateUser = async (req, res) => {
    try {
        console.log('[PUT] /profile');

        console.log(req.body);
        if(!req.body) return res.status(400).send("Informe os dados dos campos!");

        if(req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        };

        const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {returnDocument: 'after'});

        if(!user) {
            return res.status(404).json({message: "Usuário não encontrado!"});
        };

        console.log(`Usuário ${user.name} atualizado`);
        return res.status(200).json({user: user});
    }catch (err) {
        console.error('Erro ao atualizar perfil', err);
        return res.status(500).json({message: "Erro ao atualizar perfil", error: err.message});
    }
};

export const deleteIdUser = async (req, res) => {
    try{
        console.log('[DELETE] /profile');
        
        await categoryModel.deleteMany({user: req.user._id});
        await transactionModel.deleteMany({user: req.user._id});
        const user = await userModel.findByIdAndDelete(req.user._id);
        
        console.log(`Usuário ${user.name} deletado`)
        
        return res.status(200).json({ message: "Perfil deletado!" });
    }catch(err) {
        console.error('Erro ao deletar Usuário');
        return res.status(500).json({message: "Erro ao deletar perfil", error: err.message});
    };
};