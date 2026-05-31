import userModel from "../models/user.model.js";

let users = null;

const userController = {
    getAllUser: async (req, res) => {
        try {
            users = await userModel.find();

            if(!users)
                return res.status(404).send(err.message);
                
            return res.status(200).json(users);
        }catch(err) {
            return res.status(500).json(err.message);
        }
    },

    createUser: async (req, res) => {
        try {
            users = await userModel.create(req.body);

            return res.status(201).json(users);
        }catch (err) {
            res.status(500).json(err.message);
        };
    },

    deleteIdUser: async (req, res) => {
        try{
            users = await userModel.findByIdAndDelete(req.params.id);

            if(!users)
                return res.status(404).send("Not found");

            return res.status(200).send("Deleted");
        }catch(err) {
            return res.status(500).json(err.message);
        }
    }
}

export default userController;