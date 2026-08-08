export interface Categories {
  categories: {
    _id: string,
    name: string,
    user: string
  }
};

export interface AllCategories {
  categories: [
    {
      _id: string,
      name: string,
      user: string
    }
  ]
};
