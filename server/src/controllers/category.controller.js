import categoryModel from "../models/category.model.js";

let categories;

const categoryController = {
    async createCategories (req, res) {
        try {
            categories = await categoryModel.create(req.body);
            
            return res.status(204);
        }catch (err) {
            return res.status(500).json(err.message);
        };
    },

    // buscar vários registros
    async getCategories(req, res) {
        try {
            categories = await categoryModel.find().select();
            
            if(!categories) 
                return res.status(404);
            
            return res.status(200).json(categories);
        }catch(err) {
            return res.status(500).json(err.message);
        };
    }

// const deleteCategories = async (req, res) => {
    //     categories = categoryModel.
    // }
}

export default categoryController;