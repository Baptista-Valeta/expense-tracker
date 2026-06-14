import transactionModel from "../models/transaction.model.js";

let transaction = null;
const transactionController = {
    createTransaction: async (req, res) => {        
        try{
            transaction = await transactionModel.create(req.body);
                
            return res.status(201).json(transaction);
        }catch (err) {
            return res.status(500).json(err.message);
        }
    },

    getAllTransaction: async (req, res) => {
        try{
            transaction = await transactionModel.findOne({user: req.user.id});

            if(!transaction)
                return res.status(404).json({message: "Nenhuma transação encontrada"});

            return res.status(200).json({message: "Transações encontradas", transaction: transaction});
        }catch (err) {
            return res.status(500).json({message: "Erro ao buscar transações", error: err.message});
        }
    },

    getIdTransaction: async (req, res) => {
        try{
            transaction = await transactionModel.findById(req.params.id);

            if(!transaction)
                return res.status(404).json({message: "Transação não encontrada!"});

            return res.status(200).json({message: "Transação encontrada", transaction: transaction});
        }catch (err) {
            return res.status(500).json({message: "Erro ao buscar uma transação", error: err.message});
        };
    },

    updateTransaction: async (req, res) => {
        try {
            const { amount, type, description } = req.body;

            if(!amount || !type) {
                return res.status(400).json({message: "amount e type são obrigatórios"});
            };

            transaction = await transactionModel.findByIdAndUpdate(
                req.params.id,
                {amount, type},
                {
                    new: true
                }
            );

            if(!transaction)
                return res.status(404).json({message: "Transação não encontrada!"});

            return res.status(200).json({message: "Transação atualizada", transaction: transaction});
        }catch (err) {
            return res.status(500).json(err.message);
        }
    },

    deleteTransaction: async (req, res) => {
        try {
            transaction = await transactionModel.findOneAndDelete(req.user.id);
            console.log(transaction)

            if(!transaction)
                return res.status(404).json({message: "Transação não encontrada"});

            return res.status(200).json({message: "Transação removida!"});
        }catch (err) {
            return res.status(500).json({message: "Erro ao remover transação", error: err.message});
        };
    }
};

export default transactionController;