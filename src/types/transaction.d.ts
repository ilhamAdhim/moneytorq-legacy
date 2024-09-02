import { COLORS } from "./common";

export interface ITransaction {
  id: number;
  amount: number;
  title: string;
  date: string;
  description?: string;
  transaction_type: "income" | "expenses";
  category_title: string;
  category_id: number;
  color_badge: COLORS;
}
