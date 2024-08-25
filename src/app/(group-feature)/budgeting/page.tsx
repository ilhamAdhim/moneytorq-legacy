import { createClient } from "@/utils/supabase/client";
import BudgetingView from "@/views/budgeting/BudgetingView";

async function BudgetingPage() {
    const supabaseClient = createClient()
    // ? RLS still all public
    const { data, error } = await supabaseClient.from('tb_category').select().order('category_id')
    return (<BudgetingView data={data} error={error} />);
}

export default BudgetingPage;