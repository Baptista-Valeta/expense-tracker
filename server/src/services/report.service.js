import userModel from "../models/user.model.js";

export const reportValidServiceAndUpdate = (valor, type, user) => {
    if (!valor || !type || !user) {
        console.log("valor, tipo e user são obrigatórios e devem ser válidos!");
        return;
    };
    
    const reports = {
        saldo: user.saldo, 
        saldoTotalEntrado: user.saldoTotalEntrado,
        saldoTotalSaido: user.saldoTotalSaido
    };

    if (type === 'income') {
        reports.saldo += valor;
        reports.saldoTotalEntrado += valor;
    }else {
        if(reports.saldo < valor) {
            console.log("A retirada deve ser menor que o capital disponível");
            return false;
        };
        reports.saldo -= valor;
        reports.saldoTotalSaido += valor;
    };

    console.log(reports);

    reports.saldo = reports.saldo.toFixed(2);
    reports.saldoTotalEntrado = reports.saldoTotalEntrado.toFixed(2);
    reports.saldoTotalSaido = reports.saldoTotalSaido.toFixed(2);


    return userModel.findByIdAndUpdate(user._id, reports, {new: true})
        .then(result =>  {
            console.log(`Saldo atualizado ${{
            saldo: result.saldo,
            entradaTotal: result.saldoTotalEntrado,
            saidaTotal: result.saldoTotalSaido}}}`)

            return true;
        })
        .catch (err => {
            console.error(`Erro ao atualizar saldo ${err.message}`);
            return false
        });
};
