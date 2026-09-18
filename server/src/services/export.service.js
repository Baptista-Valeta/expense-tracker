import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";

export const exportTransactions = async (user_id) => {
    try{
        let transactions = await transactionModel
            .find({type: 'income'})
            .sort({date: -1})
            .lean(); // Retorna documento js simples ao invés de documentos mongoose completos
                
        let category;
        let transactions_formats = [];
        for(const transaction of transactions) {
            category = await categoryModel.findById(transaction.category);    

            transactions_formats.push({
                description: transaction.description,
                amount: transaction.amount,
                type: transaction.type,
                date: transaction.date,
                category: category.name
            });
        };

        console.log('transactions', transactions);

        const headers = ['Descrição', 'Valor', 'Tipo', 'Data', 'Categoria'];
        const rows = transactions_formats.map(transaction => [
            transaction.description,
            transaction.amount,
            transaction.type,
            transaction.date,
            transaction.category
        ]);

        console.log('rows', rows.length);

        const csv = [headers, ...rows]
            .map(row => row.map(escapeCsvValue).join(','))
            .join('\n');

        // console.log('csv', csv)
        return '\ufeff' + csv;
    } catch (error) {
        console.log('Erro ao criar csv.', error.message);
    };
};

const escapeCsvValue = (value) => {
    const stringValue = String(value ?? '');

    if(stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    };

    return stringValue;
};