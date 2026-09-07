import userModel from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        if(!req.user) return res.status(401).send("Acesso negado");
        
        if(req.user.role === "admin") {
            console.log("Permitido");
            console.log('[GET] /admin');
            
            const allUsers = await userModel.find();
            
            if(!allUsers[0]) return res.status(404).send("Nenhum usuário encontrado");
            
            console.log(`Admin ${req.user.name}`);
            console.log('Total users '+ allUsers.length);
            return res.status(200).json({Users: allUsers});
        };
        
        return res.status(401).send("Acesso negado");
    } catch(err) {
        console.log('Erro ao buscar todos os usuários', err);
        return res.status(500).json({message: "Erro ao buscar todos os users", error: err.message});
    };
};

export const deleteUser = async (req, res) => {
    try {
        console.log('/[DELETE] admin/remove');
        if(!req.params) return res.status(400).send('Informe o identificador do usuário!');
        
        const user = await userModel.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).send('Usuário não encontrado');

        return res.status(200).send('Usuário removido');
    } catch(err) {
        console.log('Erro ao remover usuário', err);
        return res.status(500).json({error: err.message, message: 'Erro ao remover usuário'});
    };
};