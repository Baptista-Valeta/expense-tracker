export interface User {
  user: {
    _id: string,
    name: string,
    email: string,
    password?: string,
    saldo: number,
    saldoTotalEntrado: number,
    saldoTotalSaido: number,
    isActive?: boolean,
    role?: string,
    createdAt?: string,
    updatedAt?: string
  };
}