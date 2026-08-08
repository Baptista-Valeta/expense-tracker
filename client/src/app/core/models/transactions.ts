export interface Transaction {
    transaction: {
        _id: string,
        amount: number,
        category: string,
        type: string,
        description: string,
        date?: Date,
        createdAt?: Date,
        updatedAt?: Date
    }
};

export interface AllTransactions {
  transaction: [
    {
      _id: string,
      amount: number,
      category: string,
      type: string,
      description: string,
      date: Date,
      createdAt: Date,
      updatedAt: Date
    }
  ]
};

export interface Reports {
  reports: {
    saldo: number,
    total_Entrado: number,
    total_Saido: number
  }
};

export interface ReportsChartDataMouthly {
  data: [
    {
      total: number, // gasto total em cada mês
      _id: {
        mounthly: number,
        year: number
      }
    }
  ]
};

export interface ReportsChartDataCategory {
  data: [
    {
      category: string,
      total: number
    }
  ]
};