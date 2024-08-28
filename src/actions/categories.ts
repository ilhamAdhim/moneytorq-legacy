"use server";

import { IFormDataManageCategory } from "@/components/composites/Modals/ModalManageCategory";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ICategory } from "@/types/categoryTypes";

const supabase = createSupabaseServer();

const getCurrentUser = async () => {
  const currentUser = await supabase.auth.getUser();
  return currentUser?.data?.user?.id || "";
};

interface IGetCategories {
  limit?: number;
  page?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
}

const getCategories = async ({ limit, page, keyword, month, year }: IGetCategories) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  let query = supabase.from("tb_category").select().order("category_id");
  if (limit && page) {
    let offset = (page - 1) * limit;
    query = query.limit(limit).range(offset, offset + limit - 1);
  }

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
  const query = supabase.from("tb_category").select().eq("id", id).single();
  return query;
};

const createCategory = async (payload: IFormDataManageCategory) => {
  const user = await getCurrentUser();
  const { data, count, error, status, statusText } = await supabase
    .from("tb_category")
    .insert([{ ...payload, user_id: user }])
    .select();

  return { data, count, error, status, statusText };
};

const updateCategory = async (payload: IFormDataManageCategory, id: number) => {
  const query = supabase.from("tb_category").update(payload).eq("category_id", id).single();
  return query;
};

const deleteCategory = async (id: number) => {
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