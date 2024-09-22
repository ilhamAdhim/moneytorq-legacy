"use server";

import { IFormDataManageTransaction } from "@/components/composites/Modals/ModalManageTransaction";
import { createSupabaseServer } from "@/lib/supabase/server";
import { format } from "date-fns";

const getCurrentUser = async () => {
  const supabase = createSupabaseServer();

  const currentUser = await supabase.auth.getUser();
  return currentUser?.data?.user?.id || "";
};

interface IGetTransactions {
  limit?: number;
  page?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  type?: "income" | "expenses";
  orderBy?: "date" | "amount";
  orderDir?: "asc" | "desc";
  withTotalIncome?: boolean;
}

const getTransactions = async ({
  limit,
  page,
  keyword,
  startDate,
  endDate,
  type,
  orderBy = "date",
  orderDir = "desc",
}: IGetTransactions) => {
  const supabase = createSupabaseServer();

  let query = supabase.from("v_transactions").select();

  if (limit) query = query.limit(limit);
  if (keyword) query = query.ilike("title", keyword);
  if (type) query.eq("transaction_type", type);
  if (orderBy) query.order(orderBy, { ascending: orderDir === "asc" ? true : false });

  if (startDate) query.gte("date", format(startDate, "yyyy-MM-dd"));
  if (endDate) query.lte("date", format(endDate, "yyyy-MM-dd"));

  if (page) {
    let offset = (page - 1) * (limit ?? 10);
    query.range(offset, offset + (limit ?? 10) - 1);
  }

  const data = await query;
  return data;
};

const getTotalIncomeLast30Days = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const supabase = createSupabaseServer();

  const data = await supabase.rpc("total_income", { start_date: startDate, end_date: endDate });
  return data;
};

const getFinanceSummary = async () => {
  const supabase = createSupabaseServer();

  const data = await supabase.from("v_finance_summary").select();
  return data;
};

const getRadarChartExpenses = async ({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) => {
  const supabase = createSupabaseServer();

  let query = supabase.from("v_ranked_expenses_summary").select();
  if (startDate) query.gte("expense_month", format(startDate, "yyyy-MM-dd"));
  if (endDate) query.lte("expense_month", format(endDate, "yyyy-MM-dd"));

  const data = await query;

  return data;
};

const getTransactionByID = async (id: number) => {
  const supabase = createSupabaseServer();
  const query = supabase.from("v_transactions").select().eq("id", id).single();
  return query;
};

const createTransaction = async (payload: IFormDataManageTransaction) => {
  const user = await getCurrentUser();

  const { type, amount, ...restPayload } = payload;
  const supabase = createSupabaseServer();

  const { data, count, error, status, statusText } = await supabase
    .from("tb_transactions")
    .insert([
      {
        transaction_type: type,
        amount: Number(amount),
        user_id: user,
        ...restPayload,
      },
    ])
    .select();

  return { data, count, error, status, statusText };
};

const updateTransaction = async (payload: IFormDataManageTransaction, id: number) => {
  const supabase = createSupabaseServer();
  const { type, amount, ...restPayload } = payload;
  const query = supabase
    .from("tb_transactions")
    .update({
      transaction_type: type,
      amount: Number(amount),
      ...restPayload,
    })
    .eq("id", id)
    .single();
  return query;
};

const deleteTransaction = async (id: number) => {
  const supabase = createSupabaseServer();
  const query = await supabase.from("tb_transactions").delete().eq("id", id);
  return query;
};

export {
  getTransactions,
  getTransactionByID,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTotalIncomeLast30Days,
  getFinanceSummary,
  getRadarChartExpenses,
};
