import { supabaseClient } from "@/supabase";
import { useState } from "react";

interface CoverLetterGeneratorParam {
  resumeUrl: string;
  jobTile: string;
  companyName: string;
  jobDescription: string;
}

export const useCoverLetterGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCoverLetter = async (
    applicationData: CoverLetterGeneratorParam,
  ): Promise<string | null> => {
    setIsLoading(true);

    try {
      const { data, error: backendError } =
        await supabaseClient.functions.invoke<{
          success: boolean;
          coverLetter?: string;
          error?: string;
        }>("generate-cover-letter", { body: applicationData });

      if (backendError) {
        setError(backendError);
        throw backendError;
      }

      if (!data?.success || !data.coverLetter) {
        setError(data?.error || "Failed to generate cover letter");
        throw new Error(data?.error || "Failed to generate cover letter");
      }

      return data.coverLetter;
    } catch (error) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateCoverLetter, isLoading, error };
};
