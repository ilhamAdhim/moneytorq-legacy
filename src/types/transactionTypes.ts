export interface ITransaction {
    type: 'income' | 'expenses',
    amount: number,
    text: string,
    id: string,
    description?: string
}