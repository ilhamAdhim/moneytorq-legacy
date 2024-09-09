import { getCategories } from "@/actions/categories";
import { getTotalIncomeLast30Days, getTransactions } from "@/actions/transactions";
import BudgetingView from "@/views/budgeting/BudgetingView";
import { format, subDays } from "date-fns";

async function BudgetingPage() {
  const {
    queryCategories: { data: dataExpensesCategories, error },
    queryTotalPercentage: { data: dataTotalPercentage },
  } = await getCategories({
    type: "expenses",
  });

  const { data: dataTotalIncome } = await getTotalIncomeLast30Days({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  return (
    <BudgetingView
      error={error}
      categoryExpenses={dataExpensesCategories || []}
      dataTotalPercentage={dataTotalPercentage}
      dataTotalIncome={dataTotalIncome}
    />
  );
}

export default BudgetingPage;
