import userModel from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        if(!req.user) return res.status(401).send("Acesso negado");

        if(req.user.role === "admin") {
            console.log("Permitido");

            const allUsers = await userModel.find();

            if(!allUsers[0]) return res.status(404).send("Nenhum usuário encontrado");

            return res.status(200).json({message: `Admin ${req.user.name}`, allUsers: allUsers});
        };
        
        return res.status(401).send("Acesso negado");
    } catch(err) {
        return res.status(500).json({message: "Erro ao buscar todos os users", error: err.message});
    }
}