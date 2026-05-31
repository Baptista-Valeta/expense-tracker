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
            transaction = await transactionModel.find();

            if(!transaction[0])
                return res.status(404).send("Not found");

            return res.status(200).json(transaction);
        }catch (err) {
            return res.status(500).json(err.message);
        }
    },

    getIdTransaction: async (req, res) => {
        try{
            transaction = await transactionModel.findById(req.params.id);

            if(!transaction)
                return res.status(404).send("Not found");

            return res.status(200).json(transaction);
        }catch (err) {
            return res.status(500).json(err.message);
        }
    },

    updateTransaction: async (req, res) => {
        try {
            transaction = await transactionModel.findByIdAndUpdate({
                id: req.params.id,
                body: req.body,
                new: true
            });

            if(!transaction)
                return res.status(404).json("Not found");

            return res.status(200).json(transaction);
        }catch (err) {
            return res.status(500).json(err.message);
        }
    },

    deleteTransaction: async (req, res) => {
        try {
            transaction = await transactionModel.findByIdAndDelete(req.params.id);

            if(!transaction)
                return res.status(404).send("Not found");

            return res.status(500).json(err.message);
        }catch (err) {}
    }
};

export default transactionController;