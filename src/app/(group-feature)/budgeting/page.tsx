import { getCategories } from "@/actions/categories";
import BudgetingView from "@/views/budgeting/BudgetingView";

async function BudgetingPage() {
  const {
    queryCategories: { data, error },
    queryTotalPercentage: { data: dataTotalPercentage },
  } = await getCategories({});
  return (
    <BudgetingView data={data || []} error={error} dataTotalPercentage={dataTotalPercentage} />
  );
}

export default BudgetingPage;
