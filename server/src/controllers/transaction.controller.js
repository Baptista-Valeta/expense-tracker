import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";
import { reportValidServiceAndUpdate } from "../services/report.service.js";

let transaction = null;
const transactionController = {
    createTransaction: async (req, res) => {        
        console.log('[POST] /api/transactions')
        try{
            if(!req.body) return res.status(400).send("Campos invalidos");

            if (typeof req.body.amount !== 'number' || req.body.amount < 0) {
                console.log("O saldo da transação deve ser number positivo!");
                return res.status(400).send("Amount inválido");
            }else if(req.body.type === 'expense' && req.body.amount > req.user.saldo) {
                console.log('Saldo insuficiente!');
                return res.status(400).send('Saldo insuficiente');
            };

            req.body.amount = Number(req.body.amount.toFixed(2));

            transaction = await transactionModel.create(req.body);

            const report = await reportValidServiceAndUpdate(transaction.amount, transaction.type, req.user);
            console.log(report);

            if(report === true) {
                console.log("Transação realizada");
            }else {
                console.log("Ocorreu algum erro durante a atualização do saldo");
                return res.status(500).json({message: 'Erro ao atualizar o saldo durante a transação'});
            };

            console.log(`Transação realizada por ${req.user.name}`);
            return res.status(201).json({transaction: transaction});
        }catch (err) {
            console.error('Erro ao criar transação', err);
            return res.status(500).json({message: 'Erro ao criar transação', error: err.message});
        };
    },

    getAllTransaction: async (req, res) => {
        console.log('[GET] /api/transactions')
        try{
            if(!req.user) return res.status(401).send("Não autorizado"); 
            transaction = await transactionModel.find({user: req.user._id});

            // transaction = await transactionModel.aggregate(
            //     [
            //         {
            //             $match: {
            //                 user: req.user._id
            //             }
            //         },
            //         // {
            //         //     $limit: 20
            //         // },
            //     ]
            // );

            if(!transaction[0])
                return res.status(404).json({message: `Nenhuma transação realizada por ${req.user.name}`});

            
            const allDates = transaction.flatMap(obj => {
                const dates = new Date(obj.date);
                const day = String(dates.getUTCDate()).padStart(2, '0');
                const month = String(dates.getUTCMonth() + 1).padStart(2, '0');
                const year = dates.getUTCFullYear();

                return `${day}-${month}-${year}`;
            });
            console.log(allDates)

            let transactionsType;
            let newObjectTransactions = [];
            
            for (let transactionElement of transaction) {
                let categoryId = !transactionElement.category ? '_id' : transactionElement.category;
                // console.log('[ID] categoryID',categoryId);
                let category = await categoryModel.findById(categoryId);

                let categoryName;
                if(!category) {
                    categoryName = '';
                }else {
                    categoryName = category.name;
                };
                
                transactionsType = (transactionElement.type === 'income'?'receita':'despesa');
                newObjectTransactions.push(
                    {
                        _id: transactionElement._id,
                        amount: transactionElement.amount,
                        category: categoryName,
                        type: transactionsType,
                        description: transactionElement.description,
                        date: transactionElement.date,
                        createdAt: transactionElement.createdAt,
                        updatedAt: transactionElement.updatedAt
                    }
                );
            };
            
            
            // console.log('Transações',newObjectTransactions);
            return res.status(200).json({transaction: newObjectTransactions.toReversed()});
        }catch (err) {
            console.error('Erro ao buscar transações:', err.message);
            return res.status(500).json({message: "Erro ao buscar transações", error: err.message});
        }
    },

    getIdTransaction: async (req, res) => {
        console.log('[GET] api/transactions/:id');
        try{
            if(!req.user) return res.status(404).send("Perfil inexistente"); 
            transaction = await transactionModel.findById(req.params.id);

            if(!transaction)
                return res.status(404).json({message: `Transação não encontrada para ${req.user.name}`});

            return res.status(200).json({transaction: transaction});
        }catch (err) {
            console.error('Erro ao buscar uma transação', err)
            return res.status(500).json({message: "Erro ao buscar uma transação", error: err.message});
        };
    },

    updateTransaction: async (req, res) => {
        console.log('[PUT] api/transactions/:id');
        try {
            if (!req.body) return res.status(400).json({error: 'Campos inválidos'});

            if (typeof req.body.amount !== 'number' || req.body.amount < 0) {
                console.log("O saldo da transação deve ser number positivo!");
                return res.status(400).send("Amount inválido");
            }
            // else if(req.body.type === 'expense' && req.body.amount > req.user.saldo) {
            //     console.log('Saldo insuficiente!',req.body.amount,req.user.saldo);
            //     return res.status(400).send('Saldo insuficiente');
            // };

            req.body.amount = Number(req.body.amount.toFixed(2));

            transaction = await transactionModel.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'before'}); // {new: false}
            
            if(!transaction) {
                return res.status(404).json({message: 'Transação não encontrada!'});
            };

            const prevAmount = transaction.amount; // Entrada anterior
            const currentAmount =  req.body.amount// Entrada Actual            
            let amount = (prevAmount > currentAmount) ? () => {
                transaction.type = transaction.type == 'expense' ? 'income' : 'expense';
                return prevAmount - currentAmount;
            } : currentAmount - prevAmount;

            console.log(transaction .type, req.body.type)
            if(prevAmount == currentAmount && transaction.type != req.body.type) {
                amount = currentAmount;
                transaction.type = req.body.type
            };
            
            amount = typeof amount == 'function' ? amount() : amount;

            console.log(prevAmount, currentAmount, amount);

            if(transaction.type === 'expense' && amount > req.user.saldo) {
                console.log(`Saldo insuficiente! ${amount} > ${req.user.saldo}`);
                transaction = await transactionModel.findByIdAndUpdate(req.params.id, {amount: prevAmount}, {returnDocument: 'after'}); // {new: false}
                return res.status(400).send('Saldo insuficiente');
            };


            const report = await reportValidServiceAndUpdate(amount, transaction.type, req.user);
            console.log(report);

            if(report === true) {
                console.log("Transação atualizada");
            }else {
                console.log("Ocorreu algum erro durante a atualização do saldo");
                return res.status(500).json({message: 'Erro ao atualizar o saldo durante a atualização'});
            };
            

            // console.log(transaction);
            return res.status(200).json({transaction: transaction});
        }catch (err) {
            console.error('Erro ao atualizar transação', err);
            return res.status(500).json({message: 'Erro ao atualizar transação', error: err.message})
        };
    },

    deleteTransaction: async (req, res) => {
        console.log('[DELETE] api/transactions/:id');
        try {
            transaction = await transactionModel.findByIdAndDelete(req.params.id);
            console.log(req.params.id);

            if(!transaction)
                return res.status(404).json({message: "Transação não encontrada"});

            console.log(`Transação removida por ${req.user.name} `, transaction);

            // await categoryModel.findByIdAndDelete(transaction.category);
            return res.status(200).json({message: "Transação removida!"});
        }catch (err) {
            console.error('Erro ao remover transação', err);
            return res.status(500).json({message: "Erro ao remover transação", error: err.message});
        };
    }
};

export default transactionController;