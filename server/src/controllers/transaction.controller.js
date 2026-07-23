import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";
import { reportValidServiceAndUpdate } from "../services/report.service.js";

let transaction = null;
const transactionController = {
    createTransaction: async (req, res) => {        
        try{
            if(!req.body) return res.status(400).send("Campos invalidos");

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

            const report = await reportValidServiceAndUpdate(transaction.amount, transaction.type, req.user);
            console.log(report);

            if(report === true) {
                console.log("Transação realizada");
            }else {
                console.log("Ocorreu algum erro durante a atualização do saldo");
                return res.status(500).json({message: 'Erro ao atualizar o saldo durante a transação'});
            }

            return res.status(201).json({message: `Transação realizada por ${req.user.name}`, transaction: transaction});
        }catch (err) {
            return res.status(500).json(err.message);
        }
    },

    getAllTransaction: async (req, res) => {
        console.log('[GET] /api/transactions')
        try{
            if(!req.user) return res.status(401).send("Não autorizado"); 
            transaction = await transactionModel.aggregate(
                [
                    {
                        $match: {
                            user: req.user._id
                        }
                    }
                ]
            );

            if(!transaction[0])
                return res.status(404).json({message: `Nenhuma transação realizada por ${req.user.name}`});


            let transactionsType;
            let newObjectTransactions = [];
            for (let transactionElement of transaction) {
                let category = await categoryModel.findById(transactionElement.category)

                transactionsType = (transactionElement.type === 'income'?'receita':'despesa')
                newObjectTransactions.push(
                    {
                        _id: transactionElement._id,
                        amount: transactionElement.amount,
                        category: category.name,
                        type: transactionsType,
                        description: transactionElement.description,
                        date: transactionElement.date,
                        createdAt: transactionElement.createdAt,
                        updatedAt: transactionElement.updatedAt
                    }
                );
            };
            
            console.log('Transações',newObjectTransactions);
            return res.status(200).json({message: `Transações realizadas por ${req.user.name}`, transaction: newObjectTransactions});
        }catch (err) {
            console.log('Erro ao buscar transações:', err.message);
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