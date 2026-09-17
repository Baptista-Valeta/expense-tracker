import transactionModel from "../models/transaction.model.js";

export const exportTransactions = async (user_id) => {
    try{
        const transactions = await transactionModel
            .find({user: user_id})
            .sort({date: -1})
            .lean(); // Retorna documento js simples ao invés de documentos mongoose
        
        const headers = ['Descrição', 'Valor', 'Tipo', 'Data', 'Categoria'];
        const rows = transactions.map(transaction => [
            transaction.description,
            transaction.amount,
            transaction.type,
            transaction.date,
            transaction.category
        ]);

        console.log('rows', rows);

        const csv = [headers, ...rows]
            .map(row => row.map(escapeCsvValue()).join(','))
            .join('\n');

        console.log('csv', csv)
        return '\ufeff' + csv;
    } catch (error) {
        console.log('Erro ao criar csv.');
        throw Error('Erro ao criar csv.');
    };
};

const escapeCsvValue = (value) => {
    const stringValue = String(value ?? '');

    if(stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    };

    return stringValue;
};