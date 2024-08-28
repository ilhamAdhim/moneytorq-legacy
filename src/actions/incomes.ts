"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

const getCurrentUser = async () => {
  const supabase = createSupabaseServer();

  const currentUser = await supabase.auth.getUser();
  return currentUser?.data?.user?.id || "";
};

const getIncomeByID = async () => {
  const supabase = createSupabaseServer();

  const uuid = await getCurrentUser();

  const query = supabase.from("tb_incomes").select("income").eq("user_id", uuid).single();
  return query;
};

const createIncome = async (income: number) => {
  const supabase = createSupabaseServer();

  const uuid = await getCurrentUser();

  const query = supabase.from("tb_incomes").insert({ income, user_id: uuid }).select();
  return query;
};

const updateIncome = async (income: number) => {
  const supabase = createSupabaseServer();

  const uuid = await getCurrentUser();
  const query = supabase.from("tb_incomes").update({ income }).eq("user_id", uuid).select();
  return query;
};

const refetchData = async () => {
  const supabase = createSupabaseServer();

  const query = await supabase
    .channel("update_tb_incomes")
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tb_incomes" }, payload => {
      console.log("Change received!", payload);
      getIncomeByID();
    });

  return query;
};

export { getIncomeByID, updateIncome, createIncome, refetchData };
