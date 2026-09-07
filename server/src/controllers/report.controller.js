import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";
import userModel from "../models/user.model.js";

export const report = async (req, res) => {
    try {
        // const user = await userModel.findById(req.user._id);

        console.log("[GET] /reports/summary");

        if(!req.user) return res.status(401).json({message: "Não autorizado"});

        console.log("Dados financeiros");

        return res.status(200).json({reports: {
            saldo: req.user.saldo,
            total_Entrado: req.user.saldoTotalEntrado,
            total_Saido: req.user.saldoTotalSaido
        }});
    }catch (err) {
        console.error('Erro ao buscar dados financeiros', err);
        return res.status(500).json({message: "Erro ao buscar dados financeiros", error: err.message});
    }
};

export const getChartDataCategory = async (req, res) => {
    try {
        console.log("[GET] /reports/chart-data-category");

        if(!req.user) return res.status(401).json({message: 'Não autorizado'});
        const transaction = await transactionModel.aggregate(
            [
                {
                    $match: {
                        user: req.user._id,
                        type: 'expense'
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        total: {
                            $sum: '$amount'
                        },
                        transactions: {
                            $count: {}
                        }
                    }
                },
                {$sort: {total: -1}}
            ]
        );

        // console.log('Category chart:', transaction);
        if(!transaction) {
            res.status(404).json({message: 'Sem dados para gráfico'});
        };

        const chartData = [];
        let percentage ;
        let percentageAll = 0;
        for (let data of transaction) {  
            let category = await categoryModel.findById(data._id);
            if (!category) {
                console.info('Categoria inexistente!');
            };
            percentage = (req.user.saldoTotalEntrado > 0) ? ((data.total/req.user.saldoTotalEntrado)*100).toFixed(2) : 0;
            percentageAll += Number(percentage); 
            chartData.push({_id: data._id, category: category.name, total: data.total, transactions: data.transactions, percentage: Number(percentage), totalPercentage: Number(percentageAll)});
        };

        // console.log('Chart-Data-Category:',chartData);

        return res.status(200).json({data: chartData});
    }catch (err) {
        console.error('Erro ao buscar dados dos gastos por categoria: ' + err.message);
        return res.status(500).json({message: 'Erro buscar dados para o gráfico de gastos por categoria', error: err.message})
    };
};

export const getIncomeCategories = async (req, res) => {
    try {
        console.log("[GET] /reports/category-income");

        if(!req.user) return res.status(401).json({message: 'Não autorizado'});
        const transaction = await transactionModel.aggregate(
            [
                {
                    $match: {
                        user: req.user._id,
                        type: 'income'
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        total: {
                            $sum: '$amount'
                        },
                        transactions: {
                            $count: {}
                        }
                    }
                },
                {$sort: {total: -1}}
            ]
        );

        // console.log('Category Income:', transaction);
        if(!transaction) {
            return res.status(404).json({message: 'Sem dados de entrada'});
        };

        const categoryIncome = [];
        let percentage;
        for (let data of transaction) {  
            let category = await categoryModel.findById(data._id);
            if (!category) {
                console.info('Categoria inexistente!');
            };
            percentage = (req.user.saldoTotalEntrado > 0) ? ((data.total/req.user.saldoTotalEntrado)*100).toFixed(2) : 0;
            categoryIncome.push({_id: data._id, category: category.name, total: data.total, transactions: data.transactions, percentage: percentage});
        };

        return res.status(200).json({data: categoryIncome});
    }catch (err) {
        console.error('Erro ao buscar dados dos gastos por categoria: ' + err.message);
        return res.status(500).json({message: 'Erro buscar dados para o gráfico de gastos por categoria', error: err.message})
    };
};

export const getChartDataMounthly = async (req, res) => {
    try {
        console.log("[GET] /reports/chart-data-mounthly");

        if(!req.user) return res.status(401).json({message: 'Não autorizado'});
        const transactions = await transactionModel.aggregate(
            [
                {
                    $addFields: {
                        month: {$month: '$date'},
                        year: {$year: '$createdAt'}
                    }
                },
                { // Filtrando os dados
                    $match: {
                        'user': req.user._id,
                        'type': 'expense'
                    }
                },
                { // agrupando por mês e ano
                    $group: {
                        _id: {month: '$month', year: '$year'},
                        total: {
                            $sum: '$amount'
                        }
                    },
                },
                { // Organiza o resultado exibido
                    $project: {
                        _id: {
                            mounthly: '$_id.month', year: '$_id.year'
                        },
                        total: 1
                    }
                },
                { // Ordena os meses de forma crescente
                    $sort: { month: 1 }
                }
            ]
        );

        if(!transactions) {
            res.status(404).json({message: 'Sem dados para gráfico'});
        };

        // console.log('Chart-Data-Mounthly:', transactions);
        
        return res.status(200).json({data: transactions});
    }catch(err) {
        console.error('Erro buscar dados dos gastos mensais', err.message);
        return res.status(500).json({message: 'Erro ao buscar dados para o gráfico de gastos mensais', error: err.message});
    };
};

export const reportAverage = async (req, res) => {
    try{
        console.log('[GET] /reports/average');
        
        const AverageTransactions = await transactionModel.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: 'expense'
                }
            },
            {
                $group: {
                    _id: '$name',
                    total: {
                        $sum: '$amount'
                    },
                    transactions: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    transactions: 1
                },
            }
        ]);

        if(!AverageTransactions[0]) {
            return res.status(404).json({message: 'Sem transações para média'});
        };

        let transactions = await transactionModel.find({user: req.user._id});
        // transactions = Math.max(...transactions.map(element => element.type=='expense'?element.amount:0));

        const media = AverageTransactions[0].total/AverageTransactions[0].transactions;
        const report = {
            transactions: transactions.length,
            average: media.toFixed(2),
            bigExpense: Math.max(...transactions.map(element => element.type=='expense'?element.amount:0))
        };

        console.log('Average',report);
        return res.status(200).json(report);
    } catch(error) {
        console.error('Erro ao buscar a maior e a média das despezas', error.message);
        return res.status(500).json({message: 'Erro ao buscar estatísticas de comparação', error: error.message});
    }
};

export const reportComparisonIncome = async (req, res) => {
    try{
        console.log('[GET] /reports/comparison-income');

        const transactions = await transactionModel.aggregate([
            {
                $addFields: {
                    month: {$month: '$date'},
                    year: {$year: '$createdAt'}
                }
            },
            { // Filtrando os dados
                $match: {
                    'user': req.user._id,
                    'type': 'income'
                }
            },
            { // agrupando por mês e ano
                $group: {
                    _id: {month: '$month', year: '$year'},
                    total: {
                        $sum: '$amount'
                    }
                },
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    year: '$_id.year',
                    total: 1,
                }
            },
            {$sort: {month: -1}}
        ]);

        console.log('comparison-income',transactions);
        if(!transactions[0]) {
            return res.status(404).json({message: 'Nenhum registro para reports de entrada para comparação com mês anterior'});
        };

        let currentMonth = 0;
        let prevMonth = 0;
        if(transactions.length > 1) {
            currentMonth = transactions[0];
            prevMonth = transactions[1];
        }else {
            currentMonth = transactions[0];
        };
        
        // Processo para encontrar o mês atual e o anterior para comparação de prograsso 
        // const months = transactions.map(month => month.month);
        // const maxMonth = Math.max(...months);
        // if(transactions.length > 1) {
        //     for(let i = 0; i < transactions.length; i++) {
        //         if(transactions[i].month === maxMonth) {
        //             currentMonth = transactions[i];
        //         }else if(transactions[i].month = (maxMonth - 1)) {
        //             prevMonth = transactions[i];
        //         };
        //     };
        // }else {
        //     // Um único mês existente
        //     console.log('Apenas um mês registrado!');
        // };

        console.log('MÊS ATUAL',currentMonth, '\nMÊS ANTERIOR', prevMonth);
        return res.status(200).json({current: currentMonth, prev: prevMonth});
    } catch(error) {
        console.error('Erro ao buscar reports de entrada para comparação com mês anterior', error.message);
        return res.status(500).json({message: 'Erro ao buscar reports de entrada para comparação com mês anterior', error: error.message})
    };
};