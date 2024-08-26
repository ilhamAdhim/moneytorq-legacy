"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

const supabase = createSupabaseServer();

const getCurrentUser = async () => {
  const currentUser = await supabase.auth.getUser();
  return currentUser?.data?.user?.id || "";
};

const getIncomeByID = async () => {
  const uuid = await getCurrentUser();

  const query = supabase.from("tb_incomes").select("income").eq("user_id", uuid).single();
  return query;
};

const createIncome = async (income: number) => {
  const uuid = await getCurrentUser();

  const query = supabase.from("tb_incomes").insert({ income, user_id: uuid }).select();
  return query;
};

const updateIncome = async (income: number) => {
  const uuid = await getCurrentUser();
  const query = supabase.from("tb_incomes").update({ income }).eq("user_id", uuid).select();
  return query;
};

const refetchData = async () =>
  await supabase
    .channel("update_tb_incomes")
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tb_incomes" }, payload => {
      console.log("Change received!", payload);
      getIncomeByID();
    });

export { getIncomeByID, updateIncome, createIncome, refetchData };
