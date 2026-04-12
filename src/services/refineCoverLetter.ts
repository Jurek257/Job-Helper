import { supabaseClient } from "@/supabase";
import type { ChatMessage } from "@/types/types";

export const refineCoverLetter = async (
  messages: ChatMessage[],
  instruction: string,
): Promise<string> => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) throw new Error("User not authenticated");

  const { data, error } = await supabaseClient.functions.invoke(
    "refine-cover-letter",
    {
      body: { messages, instruction },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (error) throw error;
  if (!data.success) throw new Error(data.error || "failed to refine cover letter");

  return data.coverLetter as string;
};
