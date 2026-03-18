import { supabaseClient } from "@/supabase";
import type { GenerateCoverLetterParams } from "@/types/types";

export const generateCoverLetter = async (
  params: GenerateCoverLetterParams,
) => {
  const { data, error } = await supabaseClient.functions.invoke(
    "generate-cover-letter",
    { body: params },
  );

  if (error) throw error;
  if (!data.success)
    throw new Error(data.error || "failed to generate cover letter");

  return data.coverLetter as string;
};
