
import { getCategories } from "@/actions/categories";
import { ICategoryResponse } from "@/types/categoryTypes";
import BudgetingView from "@/views/budgeting/BudgetingView";

async function BudgetingPage() {
    const { queryCategories: { data, error }, queryTotalPercentage: { data: dataTotalPercentage } } = await getCategories({})
    console.log(dataTotalPercentage)
    return (<BudgetingView data={data || []} error={error} dataTotalPercentage={dataTotalPercentage} />);
}

export default BudgetingPage;