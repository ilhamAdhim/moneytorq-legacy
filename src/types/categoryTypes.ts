import { ReactElement } from "react";
import { COLORS } from "./common";
export interface ICategory {
  id: number;
  desc?: string;
  budgetPercentage?: number;
  category_title: string;
  icon?: ReactElement;
  colorBadge: COLORS;
}

export interface ICategoryResponse {
  category_id: number;
  created_at: string;
  category_title: string;
  percentage_amount: number;
  color_badge: string;
  user_id: string;
  description: any;
}
