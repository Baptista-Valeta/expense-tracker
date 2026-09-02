
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
        _id: string,
        category: string,
        total: number,
        transactions: number,
        percentage: number
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

export interface ReportBigExpense {
  transactions: number,
  average: number,
  bigExpense: number
};

export interface ComparisonMonths {
  current: {
    total: number,
    month?: number,
    year?: number
  };
  prev?: {
    total: number,
    month?: number,
    year?: number
  }
}

