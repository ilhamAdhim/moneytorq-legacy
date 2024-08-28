"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { ITransaction } from "@/types/transactionTypes";

interface IGetTransactions {
  limit?: number;
  page?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
}

const getTransactions = async ({ limit, page, keyword, month, year }: IGetTransactions) => {
  const supabase = createSupabaseServer();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  let query = supabase.from("tb_transaction").select().order("transaction_id");
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

const gettransactionByID = async (id: number) => {
  const supabase = createSupabaseServer();
  const query = supabase.from("tb_transaction").select().eq("id", id).single();
  return query;
};

const createtransaction = async (payload: ITransaction) => {
  const { type } = payload;
  const supabase = createSupabaseServer();

  const { data, count, error, status, statusText } = await supabase
    .from("tb_transaction")
    .insert([
      {
        transaction_type: type,
        ...payload,
      },
    ])
    .select();

  return { data, count, error, status, statusText };
};

const updatetransaction = async (payload: ITransaction, id: number) => {
  const supabase = createSupabaseServer();
  const { type } = payload;
  const query = supabase
    .from("tb_transaction")
    .update({
      transaction_type: type,
      ...payload,
    })
    .eq("id", id)
    .single();
  return query;
};

const deletetransaction = async (id: number) => {
  const supabase = createSupabaseServer();
  const query = await supabase.from("tb_transaction").delete().eq("id", id);
  return query;
};

export {
  getTransactions,
  gettransactionByID,
  createtransaction,
  updatetransaction,
  deletetransaction,
};
