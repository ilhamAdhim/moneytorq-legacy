"use server";

import { IFormDataManageTransaction } from "@/components/composites/Modals/ModalManageTransaction";
import { createSupabaseServer } from "@/lib/supabase/server";

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
  month?: number;
  year?: number;
}

const getTransactions = async ({
  limit,
  page,
  keyword,
  month,
  year,
  startDate,
  endDate,
}: IGetTransactions) => {
  const supabase = createSupabaseServer();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  let query = supabase.from("v_transactions").select().order("date", { ascending: false });

  if (limit && page) {
    let offset = (page - 1) * limit;
    query = query
      .limit(limit) // Set your desired limit per page (e.g., 10)
      .range(offset, offset + limit - 1);
  }

  if (keyword) query = query.ilike("title", keyword);
  if (month || year) {
    query = query
      .gte("created_at", `${year || currentYear}-${month || currentMonth}-01`)
      .lt("created_at", `${year || currentYear}-${month || currentMonth}-01`);
  }

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
};
