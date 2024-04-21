import { ICategory } from "./categoryTypes"

export interface ITransaction {
    id: string,
    amount: number,
    text: string,
    date: string,
    description?: string
    type: 'income' | 'expenses',
    categories: ICategory[]
}