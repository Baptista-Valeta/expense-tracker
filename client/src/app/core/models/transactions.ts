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