import { supabaseClient } from "@/supabase";
import type { GenerateCoverLetterParams } from "@/types/types";

export const generateCoverLetter = async (
  params: GenerateCoverLetterParams,
) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }
  const { data, error } = await supabaseClient.functions.invoke(
    "generate-cover-letter",
    {
      body: params,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (error) throw error;
  if (!data.success)
    throw new Error(data.error || "failed to generate cover letter");

  return data.coverLetter as string;
};
