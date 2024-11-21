"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { IUserProfileData } from "@/types/auth";

export const verifyOtp = async (data: { email: string; otp: string; type: string }) => {
  const supabase = createSupabaseServer();

  const res = await supabase.auth.verifyOtp({
    email: data.email,
    token: data.otp,
    type: "email",
  });
  return JSON.stringify(res);
};

export const signOut = async () => {
  const supabase = createSupabaseServer();

  const res = await supabase.auth.signOut();
  return JSON.stringify(res);
};

export const getCurrentUser: () => Promise<IUserProfileData> = async () => {
  const supabase = createSupabaseServer();

  const currentUser = await supabase.auth.getUser();
  const infoProfile = await supabase
    .from("profiles")
    .select()
    .eq("id", currentUser?.data?.user?.id)
    .single();
  return infoProfile.data;
};
