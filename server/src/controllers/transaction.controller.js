import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";
import { reportValidServiceAndUpdate } from "../services/report.service.js";

let transaction = null;
const transactionController = {
    createTransaction: async (req, res) => {        
        try{
            if(!req.body) return res.status(400).send("Campos vazio");

            if (typeof req.body.amount !== 'number' || req.body.amount < 0) {
                console.log("O saldo da transação deve ser number positivo!");
                return res.status(400).send("Amount inválido");
            }

            req.body.amount = req.body.amount.toFixed(2);

            transaction = await transactionModel.create(req.body);

            console.log({
                type: transaction.type,
                username: req.user
            });

            if(reportValidServiceAndUpdate(transaction.amount, transaction.type, req.user) === true) {
                console.log("Transação realizada");
            }else {
                console.log("Ocorreu algum erro durante a atualização do saldo");
            }

            return res.status(201).json({message: `Transação realizada por ${req.user.name}`, transaction: transaction});
        }catch (err) {
            return res.status(500).json(err.message);
        }
    },

    getAllTransaction: async (req, res) => {
        try{
            if(!req.user) return res.status(404).send("Perfil inexistente"); 
            transaction = await transactionModel.find({user: req.user._id});

            if(!transaction[0])
                return res.status(404).json({message: `Nenhuma transação realizada por ${req.user.name}`});

            return res.status(200).json({message: `Transações realizadas por ${req.user.name}`, transaction: transaction});
        }catch (err) {
            return res.status(500).json({message: "Erro ao buscar transações", error: err.message});
        }
    },

    getIdTransaction: async (req, res) => {
        try{
            if(!req.user) return res.status(404).send("Perfil inexistente"); 
            transaction = await transactionModel.findById(req.params.id);

            if(!transaction)
                return res.status(404).json({message: `Transação não encontrada para ${req.user.name}`});

            return res.status(200).json({message: `Transação encontrada para ${req.user.name}`, transaction: transaction});
        }catch (err) {
            return res.status(500).json({message: "Erro ao buscar uma transação", error: err.message});
        };
    },

    deleteTransaction: async (req, res) => {
        try {
            transaction = await transactionModel.findByIdAndDelete(req.params.id);
            console.log(req.params.id)

            if(!transaction)
                return res.status(404).json({message: "Transação não encontrada"});

            return res.status(200).json({message: "Transação removida!"});
        }catch (err) {
            return res.status(500).json({message: "Erro ao remover transação", error: err.message});
        };
    }
};

export default transactionController;