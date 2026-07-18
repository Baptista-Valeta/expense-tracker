import categoryModel from "../models/category.model.js";
import transactionModel from "../models/transaction.model.js";

export const report = async (req, res) => {
    try {
        // const user = await userModel.findById(req.user._id);

        if(!req.user) return res.status(401).json({message: "Não autorizado"});

        console.log(req.user);

        res.status(200).json({message: "Dados financeiros:", reports: {
            saldo: req.user.saldo,
            total_Entrado: req.user.saldoTotalEntrado,
            total_Saido: req.user.saldoTotalSaido
        }});
    }catch (err) {
        res.status(500).json({message: "Erro ao buscar dados financeiros", error: err.message});
    }
};

export const getChartData = async (req, res) => {
    try {
        if(!req.user) return res.status(401).json({message: 'Não autorizado'});
        const al = 'alimentação'
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
                        }
                    }
                }
            ]
        );

        if(!transaction) {
            res.status(404).json({message: 'Sem dados para gráfico'});
        };
        const chartData = []
        for (let data of transaction) {
            let category = await categoryModel.findById(data._id);
            chartData.push({category: category.name, total: data.total});
        };

        console.log('ChartData:',chartData);

        return res.status(200).json({message: 'Chart-data', data: chartData});
    }catch (err) {
        console.error('Erro ao buscar dados do gráfico: ' + err.message);
        return res.status(500).json({message: 'Erro ao buscar chart-data', error: err.message})
    }
} ;