import { ReactElement } from "react";
import { COLORS } from "./common";
export interface ICategory { 
    id: number,
    desc?: string
    budgetPercentage?: number,
    category_title: string,
    icon?: ReactElement
    colorBadge: COLORS
}