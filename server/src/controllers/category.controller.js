import categoryModel from "../models/category.model.js";

let categories;

const categoryController = {
    // criar categoria
    async createCategories (req, res) {
        try {
            categories = await categoryModel.create(req.body);
            
            return res.status(201).json(categories);
        }catch (err) {
            return res.status(500).json(err.message);
        };
    },

    // buscar vários registros
    async getAllCategories(req, res) {
        try {
            categories = await categoryModel.find().select();

            if(!categories)
                return res.status(404).send("Not found");
            
            return res.status(200).json(categories);
        }catch(err) {
            return res.status(500).json(err.message);
        };
    },

    // para um registro específico
    async getIdCategory(req, res) {
        try {
            categories = await categoryModel.findById(req.params.id);

            if(!categories)
                return res.status(404).send("Not found");
            
            return res.status(200).json(categories);
        }catch (err) {
            return res.status(500).json(err.message);
        };
    },

    async updateIdCategory(req, res) {
        try {
            categories = await categoryModel.findByIdAndUpdate(req.params.id, req.body, {new: true});

            if(!categories)
                return res.status(404).send("Not found");

            return res.status(200).json(categories);
        } catch(err) {
            return res.status(500).json(err.message);
        };
    },

    async deleteIdCategory(req, res) {
        try {
            categories = await categoryModel.findOneAndDelete(req.params.id);

            if(!categories)
                return res.status(404).send("Not found");

            return res.status(200).send("Deleted");
        } catch(err) {
            res.status(500).json(err.message)
        };
    }

}

export default categoryController;