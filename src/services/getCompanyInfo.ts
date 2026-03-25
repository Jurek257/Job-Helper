import { supabaseClient } from "@/supabase";

export const getCompanyInfo = async (companyName: string): Promise<string> => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabaseClient.functions.invoke(
    "get-company-info",
    {
      body: { companyName },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );

  if (error) throw error;
  if (!data.success) throw new Error(data.error || "Failed to get company info");

  return data.info as string;
};
