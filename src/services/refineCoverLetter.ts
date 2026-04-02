import { supabaseClient } from "@/supabase";

export const refineCoverLetter = async (
  currentLetter: string,
  instruction: string,
): Promise<string> => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) throw new Error("User not authenticated");

  const { data, error } = await supabaseClient.functions.invoke(
    "refine-cover-letter",
    {
      body: { currentLetter, instruction },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (error) throw error;
  if (!data.success) throw new Error(data.error || "failed to refine cover letter");

  return data.coverLetter as string;
};
