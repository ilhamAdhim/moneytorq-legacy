export interface ITransaction {
    type: 'income' | 'expenses',
    amount: number,
    text: string,
    id: string,
    date: string,
    description?: string
}