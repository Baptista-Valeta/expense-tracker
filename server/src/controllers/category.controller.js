import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";

let categories;

const categoryController = {
    // criar categoria
    createCategories: async (req, res) => {
        try {
            console.log('[POST] /categories');

            const {name, user} = req.body;
            if(!name || !user) {
                console.error('name ou userId Inválido');
                return res.status(400).json({message: 'O campo name e userId são obrigatórios!'})
            };
            categories = await categoryModel.create(req.body);
            
            console.log('Categoria criada:', categories);

            return res.status(201).json({categories: categories});
        }catch (err) {
            console.error('Erro ao criar categoria', err.message);
            return res.status(500).json({message: "Erro ao criar categoria", err: err.message});
        };
    },

    // buscar vários registros
    getAllCategories: async  (req, res) => {
        try {
            console.log('[GET] /categories');

            if(!req.user) return res.status(404).send("Perfil inexistente"); 

            categories = await categoryModel.find({user: req.user._id});

            if(!categories[0]) {
                return res.status(404).json({message: `Nenhuma categoria encontrada para ${req.user.name}`,});
            }
            
            return res.status(200).json({categories: categories});
        }catch(err) {
            console.error('Erro ao buscar categorias', err);
            return res.status(500).json({message: "Erro ao buscar categorias", err: err.message});
        };
    },

    // para um registro específico
    getIdCategory: async (req, res) => {
        try {
            console.log('[GET] /categories/:id');

            if(!req.user) return res.status(404).send("Perfil inexistente"); 
            categories = await categoryModel.findById(req.params.id);

            if(!categories)
                return res.status(404).json({message: "Categoria não encontrada"});
            
            return res.status(200).json({categories: categories});
        }catch (err) {
            console.error('Erro ao buscar categoria', err);
            return res.status(500).json({message: "Erro ao buscar categoria", err: err.message});
        };
    },

    updateIdCategory: async (req, res) => {
        try {
            console.log('[PUT] /categories');

            if(!req.body.name) {
                return res.status(400).json({message: "informe o nome da categoria"});
            };

            categories = await categoryModel.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});

            if(!categories)
                return res.status(404).json({message: "Erro ao atualizar. categoria não encontrado"});

            console.log(req.body);
            console.log(categories);
            console.log("Categoria atualizada");
            return res.status(200).json({categories: categories});
        } catch(err) {
            console.error('Erro ao atualizar categoria', err.message)
            return res.status(500).json({message: 'Erro ao atualizar categoria', error: err});
        };
    },

    deleteIdCategory: async (req, res) => {
        try {
            console.log('[DELETE] /categories');
            const transactions = await transactionModel.find({category: req.params.id});
            
            if(transactions.length > 0) {
                console.log('Transações associadas', transactions.length);
                return res.status(400).send('Transação associada');
            };

            console.log('Nenhuma transação associada');

            categories = await categoryModel.findByIdAndDelete(req.params.id);
            
            if(!categories)
                return res.status(404).json({message: "Impossível deletar. Categoria não encontrada"});
            
            return res.status(200).json({message: `Categoria deletado de ${req.user.name}`});
        } catch(err) {
            console.error('Erro ao remover categoria', err.message)
            res.status(500).json({message: "Erro ao deletar categoria", error: err.message})
        };
    }

};

export default categoryController;