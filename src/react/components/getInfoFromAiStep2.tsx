import { LoadingButton } from "./loading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateCoverLetter } from "@/services/generateCoverLetter";
import { getCompanyInfo } from "@/services/getCompanyInfo";
import type { GenerateCoverLetterParams } from "@/types/types";
import jsPDF from "jspdf";
//import { useCardActions } from "@/hooks/useCardActions";

interface Props {
  data: GenerateCoverLetterParams;
}

export function GetInfoFromAiStep2({ data }: Props) {
  const navigate = useNavigate();
  const [isAnswerLoading, setIsAnswerLoading] = useState<boolean>(false);
  //const [isAnswerGenerated, setIsAnswerGenerated] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string>("");
  //const { addNewJobCard } = useCardActions();

  const { resumeURL, jobTitle, companyName, jobDescription } = data;

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ compress: false });
    const margin = 25;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setLineHeightFactor(1.6);
    doc.setProperties({
      title: `Cover Letter - ${companyName}`,
      subject: "Job Application Cover Letter",
      author: "JobHelper",
      keywords: " ".repeat(10000),
    });

    const lines = doc.splitTextToSize(coverLetter, maxWidth);
    doc.text(lines, margin, margin + 15);
    doc.save(`cover-letter-${companyName}.pdf`);
  };

  const [isCompanyInfoLoading, setIsCompanyInfoLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<string>("");
  const [additionalContext, setAdditionalContext] = useState<string>("");

  const handleGetCompanyInfo = async () => {
    setIsCompanyInfoLoading(true);
    try {
      const info = await getCompanyInfo(companyName);
      setCompanyInfo(info);
    } catch (error: any) {
      console.error("message:", error?.message);
      try {
        const body = await error?.context?.json();
        console.error("response body:", JSON.stringify(body, null, 2));
      } catch {
        const text = await error?.context?.text?.();
        console.error("response text:", text);
      }
    } finally {
      setIsCompanyInfoLoading(false);
    }
  };

  const handleGenerateCoverLetter = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsAnswerLoading(true);
    try {
      console.log("Sending params:", {
        // ✅ Посмотри что именно отправляешь
        resumeURL,
        jobTitle,
        companyName,
        jobDescription,
      });
      const letter = await generateCoverLetter({
        resumeURL,
        jobTitle,
        companyName,
        jobDescription,
        companyInfo: companyInfo || undefined,
        additionalContext: additionalContext || undefined,
      });

      setCoverLetter(letter);
      //setIsAnswerGenerated(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnswerLoading(false);
    }
  };
  /* 
const handleAddNewJobCard = (e: React.SyntheticEvent<HTMLFormElement>) => {

} */
  /* const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormLoading(true);
  
      try {
        await addNewJobCard(e);
        navigate("/");
      } catch (error) {
        console.error(error);
      } finally {
        setFormLoading(false);
      } */
  return (
    <div className="w-full sm:w-[800px] h-auto bg-[var(--surface-color)]  border border-[var(--border-color)] border-t-3 border-t-blue-500 rounded-2xl drop-shadow-x1 z-5">
      <div className="bg-blue-500/20 px-5 py-5 rounded-t-2xl border-b-3 border-b-[var(--border-color)]">
        <h2 className="text-[28px] font-bold">
          Generate a unique Cover letter for this application
        </h2>
        <p className="text-white/50">
          Applying with a cover letter increases your chances of getting hired
          by 50%.
        </p>
      </div>

      <form
        onSubmit={handleGenerateCoverLetter}
        className="w-full h-full flex flex-col justify-between"
        action=""
      >
        <div className="flex flex-col px-5 py-2 w-full gap-2">
          <span className="font-bold">COMPANY INFO</span>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={companyName}
              className="flex-1 border focus:outline-none rounded-md border-white/20 px-3 py-2 bg-white/5"
            />
            <button
              type="button"
              onClick={handleGetCompanyInfo}
              disabled={isCompanyInfoLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isCompanyInfoLoading ? "Loading..." : "Get Info"}
            </button>
          </div>
          {companyInfo && (
            <textarea
              readOnly
              value={companyInfo}
              rows={7}
              className="border focus:outline-none rounded-md border-white/20 pl-3 pt-2 bg-white/5 resize-none"
            />
          )}
        </div>

        <label className="flex flex-col px-5 py-2 w-full" htmlFor="additional_context">
          <span className="font-bold">ADDITIONAL CONTEXT (OPTIONAL)</span>
          <textarea
            name="additional_context"
            id="additional_context"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            className="border focus:outline-none rounded-md border-white/20 pl-3 h-22"
          ></textarea>
        </label>
        {coverLetter && (
          <div className="flex flex-col h-auto px-5 py-2 w-full gap-2">
            <textarea
              name="ai_answer"
              id=""
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={15}
              className="border focus:outline-none rounded-md border-white/20 pl-3"
            ></textarea>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="self-end bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-1"
            >
              Download PDF
            </button>
          </div>
        )}
        <div className="flex m-3 self-end gap-3">
          {isAnswerLoading ? (
            <LoadingButton />
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-[var(--surface-color)] border border-[var(--border-color)] cursor-pointer text-white px-6 py-2 rounded-lg"
              >
                Skip
              </button>
              <button
                type="submit"
                className="bg-blue-500 shadow-2xl shadow-blue-500/50 text-white px-6 py-2 cursor-pointer rounded-lg hover:-translate-y-1 transition-all duration-200"
              >
                Generate
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
