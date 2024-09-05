import { getCategories } from "@/actions/categories";
import BudgetingView from "@/views/budgeting/BudgetingView";

async function BudgetingPage() {
  const {
    queryCategories: { data: dataExpensesCategories, error },
    queryTotalPercentage: { data: dataTotalPercentage },
  } = await getCategories({});
  const {
    queryCategories: { data: dataIncomeCategories },
  } = await getCategories({
    type: "income",
  });
  return (
    <BudgetingView
      categoryExpenses={dataExpensesCategories || []}
      error={error}
      dataTotalPercentage={dataTotalPercentage}
    />
  );
}

export default BudgetingPage;
