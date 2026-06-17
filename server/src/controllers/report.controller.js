import userModel from "../models/user.model.js";

export const report = async (req, res) => {
    try {
        // const user = await userModel.findById(req.user._id);

        if(!req.user) res.status(404).json({message: "Usuário não encontrado"});

        console.log(req.user);

        res.status(200).json({message: "Dados financeiros:", reports: {
            saldo: req.user.saldo,
            total_Entrado: req.user.saldoTotalEntrado,
            total_Saido: req.user.saldoTotalSaido
        }});
    }catch (err) {
        res.status(500).json({message: "Erro ao buscar dados financeiros", error: err.message});
    }
};