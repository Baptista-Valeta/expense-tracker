import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";

export const exportTransactions = async (user_id) => {
    let transactions = await transactionModel
        .find({user: user_id})
        .sort({date: -1})
        .lean(); // Retorna documento js simples ao invés de documentos mongoose completos

    let category;
    let transactions_formats = [];
    for(const transaction of transactions) {
        category = await categoryModel.findById(transaction.category);    
        const day = new Date(transaction.date).getDate().toString();
        const month = new Date(transaction.date).getMonth()+1;
        const year = new Date(transaction.date).getFullYear();
        const date = `${day.length==1?'0'+day:day}-${String(month).length==1?'0'+month:month}-${year}`;
        const type = transaction.type == 'expense'? 'Despesa': 'Receita';
        transactions_formats.push({
            description: transaction.description,
            amount: transaction.amount,
            type: type,
            date: date,
            category: category.name
        });
    };

    // console.log('transactions', transactions_formats);

    const headers = ['Categoria', 'Valor', 'Tipo', 'Data', 'Descrição'];
    const rows = transactions_formats.map(transaction => [
        transaction.category,
        transaction.amount,
        transaction.type,
        transaction.date,
        transaction.description
    ]);

    // console.log('rows', rows);

    const csv = [headers, ...rows]
        .map(row => row.map(escapeCsvValue).join(','))
        .join('\n');

    // console.log('csv', csv)
    return '\ufeff' + csv;
};

const escapeCsvValue = (value) => {
    const stringValue = String(value ?? '');

    if(stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    };

    return stringValue;
};