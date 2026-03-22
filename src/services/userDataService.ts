import { supabaseClient } from "@/supabase";

export const fetchResumeURLifExists = async (user_id: string) => {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("resume_url")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    console.warn(error?.message);
    return null;
  }

  if (!data) {
    console.warn("user not found");
    return null;
  }
  console.log(data.resume_url);
  return data.resume_url;
};
