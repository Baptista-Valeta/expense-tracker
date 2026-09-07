import userModel from "../models/user.model.js";

export const reportValidServiceAndUpdate = (valor, type, user) => {
    if (typeof valor != 'number' || !type || !user) {
        console.log("valor, tipo e user são obrigatórios e devem ser válidos!");
        return false;
    };
    
    const reports = {
        saldo: user.saldo, 
        saldoTotalEntrado: Number(user.saldoTotalEntrado),
        saldoTotalSaido: Number(user.saldoTotalSaido)
    };

    if (type === 'income') {
        reports.saldo += valor;
        reports.saldoTotalEntrado += valor;
    }else {
        if(reports.saldo < valor) {
            console.log("A retirada deve ser menor que o montante disponível");
            return false;
        };
        reports.saldo -= valor;
        reports.saldoTotalSaido += valor;
    };

    console.log(reports);

    reports.saldo = reports.saldo.toFixed(2);
    reports.saldoTotalEntrado = reports.saldoTotalEntrado.toFixed(2);
    reports.saldoTotalSaido = reports.saldoTotalSaido.toFixed(2);


    return userModel.findByIdAndUpdate(user._id, reports, {returnDocument: 'after'})
        .then(result =>  {
            return true;
        })
        .catch (err => {
            console.error(`Erro ao atualizar saldo ${err.message}`);
            return false
        });
};

export const EstatisticsComparison = () => {
    
};