export interface Categories {
  categories: {
    _id: string,
    name: string,
    user: string,
    createAt?: Date,
    updateAt?: Date
  }
};

export interface CategoryStatistics {
  categories: [
    {    
      _id: string,
      name: string,
      gastos: number,
      transactions: number
    },
  ]
};

export interface AllCategories {
  categories: [
    {
      _id: string,
      name: string,
      user: string,
      transactions: number,
      createdAt?: Date,
      updatedAt?: Date
    }
  ]
};
