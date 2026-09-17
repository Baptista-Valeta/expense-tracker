import { exportTransactions } from '../services/export.service.js';

export const ExportData = async (req, res) => {
    try{
        console.log('[GET] /api/reports/export')
        const csv = await exportTransactions(req.user._id);
        console.log('csv-controller', csv);

        res.setHeader('Content-Type', 'text/csv, charset=utf-8');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="transactions.csv"'
        );

        return res.status(200).send(csv);
    } catch(error) {
        console.log('Erro ao exportar transações');
        res.status(500).json({message: 'Erro ao exportar transações', error: error});
    };
};