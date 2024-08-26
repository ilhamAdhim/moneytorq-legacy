
import { getCategories } from "@/actions/categories";
import { ICategoryResponse } from "@/types/categoryTypes";
import BudgetingView from "@/views/budgeting/BudgetingView";

async function BudgetingPage() {
    const { data, error } = await getCategories({})

    return (<BudgetingView data={data || []} error={error} />);
}

export default BudgetingPage;