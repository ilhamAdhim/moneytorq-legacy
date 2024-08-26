"use server";

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
    query = query
      .limit(limit) // Set your desired limit per page (e.g., 10)
      .range(offset, offset + limit - 1);
  }

  if (keyword) query = query.ilike("category_title", keyword);
  if (month || year) {
    query = query
      .gte("created_at", `${year || currentYear}-${month || currentMonth}-01`)
      .lt("created_at", `${year || currentYear}-${month || currentMonth}-01`);
  }

  const data = await query;
  return data;
};

const getCategoryByID = async (id: number) => {
  const query = supabase.from("tb_category").select().eq("id", id).single();
  return query;
};

const createCategory = async (payload: ICategory) => {
  const { category_title, colorBadge, budgetPercentage, desc } = payload;

  const { data, count, error, status, statusText } = await supabase
    .from("tb_category")
    .insert([
      {
        category_title,
        color_badge: colorBadge,
        budget_percentage: budgetPercentage,
        description: desc,
      },
    ])
    .select();

  return { data, count, error, status, statusText };
};

const updateCategory = async (payload: ICategory, id: number) => {
  const { category_title, colorBadge, budgetPercentage, desc } = payload;
  const query = supabase
    .from("tb_category")
    .update({
      category_title,
      color_badge: colorBadge,
      budget_percentage: budgetPercentage,
      description: desc,
    })
    .eq("id", id)
    .single();
  return query;
};

const deleteCategory = async (id: number) => {
  const query = await supabase.from("tb_category").delete().eq("category_id", id).select();
  return query;
};

export { getCategories, getCategoryByID, createCategory, updateCategory, deleteCategory };
