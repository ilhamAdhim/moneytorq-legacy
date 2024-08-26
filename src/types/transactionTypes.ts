export interface ITransaction {
  id: string;
  amount: number;
  title: string;
  date: string;
  description?: string;
  type: "income" | "expenses";
  category_id: number;
}
