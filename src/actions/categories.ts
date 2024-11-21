"use server";

import { IFormDataManageCategory } from "@/components/composites/Modals/ModalManageCategory";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getCurrentUser } from "./auth";
import { freeTrialError } from "@/utils/common";

interface IGetCategories {
  limit?: number;
  page?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  type?: "income" | "expenses";
}

const getCategories = async ({ limit, page, keyword, month, year, type }: IGetCategories) => {
  const supabase = createSupabaseServer();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  let query = supabase.from("tb_category").select().order("category_id");
  if (limit && page) {
    let offset = (page - 1) * limit;
    query = query.limit(limit).range(offset, offset + limit - 1);
  }

  if (type) query = query.eq("category_type", type);
  if (keyword) query = query.ilike("category_title", keyword);
  if (month || year) {
    query = query
      .gte("created_at", `${year || currentYear}-${month || currentMonth}-01`)
      .lt("created_at", `${year || currentYear}-${month || currentMonth}-01`);
  }

  const data = await query;

  const queryTotalPercentage = await supabase.rpc("total_budget");

  return { queryCategories: data, queryTotalPercentage };
};

const getCategoryByID = async (id: number) => {
  const supabase = createSupabaseServer();

  const query = supabase.from("tb_category").select().eq("id", id).single();
  return query;
};

// ? If user.is_premium_user || user.is_using_free_trial, then just proceed CRUD
// ? If free trial has ended and user is not premium yet, then returns error msg
// ? Free trial automatically ends when an account is one month from its registration date

const createCategory = async (payload: IFormDataManageCategory) => {
  const supabase = createSupabaseServer();

  const user = await getCurrentUser();
  if (user.is_premium_user || user.is_using_free_trial) {
    const { budget_type, ...restPayload } = payload;

    const { data, count, error, status, statusText } = await supabase
      .from("tb_category")
      .insert([
        { ...restPayload, user_id: user.id, is_using_percentage: budget_type === "percentage" },
      ])
      .select();

    return { data, count, error, status, statusText };
  }

  return freeTrialError;
};

const updateCategory = async (payload: IFormDataManageCategory, id: number) => {
  const user = await getCurrentUser();

  if (user.is_premium_user || user.is_using_free_trial) {
    const supabase = createSupabaseServer();
    const { budget_type, ...restPayload } = payload;
    const query = supabase
      .from("tb_category")
      .update({ ...restPayload, is_using_percentage: budget_type === "percentage" })
      .eq("category_id", id)
      .single();
    return query;
  }
  return freeTrialError;
};

const deleteCategory = async (id: number) => {
  const supabase = createSupabaseServer();

  const query = await supabase.from("tb_category").delete().eq("category_id", id).select();
  return query;
};

const getTotalPercentage = async () => {};

export {
  getCategories,
  getCategoryByID,
  createCategory,
  updateCategory,
  deleteCategory,
  getTotalPercentage,
};
