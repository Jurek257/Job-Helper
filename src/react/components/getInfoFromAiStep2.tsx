import { LoadingButton } from "./loading";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateCoverLetter } from "@/services/generateCoverLetter";
import { refineCoverLetter } from "@/services/refineCoverLetter";
import { getCompanyInfo } from "@/services/getCompanyInfo";
import type { GenerateCoverLetterParams } from "@/types/types";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";
import { supabaseClient } from "@/supabase";

interface Props {
  data: GenerateCoverLetterParams;
}

export function GetInfoFromAiStep2({ data }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { resumeURL, jobTitle, companyName, jobDescription } = data;

  const [isAnswerLoading, setIsAnswerLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  // Single instruction field — serves as additionalContext before generation, and refine chat after
  const [instructionText, setInstructionText] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isCompanyInfoLoading, setIsCompanyInfoLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState("");

  const [fileName, setFileName] = useState(`cover-letter-${companyName}`);

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabaseClient
        .from("profiles")
        .select("name")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.name) {
            const lastName = data.name.trim().split(" ").pop();
            setFileName(`cover-letter-${companyName}-${lastName}`);
          }
        });
    });
  }, [companyName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

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
    doc.save(`${fileName}.pdf`);
  };

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
      const letter = await generateCoverLetter({
        resumeURL,
        jobTitle,
        companyName,
        jobDescription,
        companyInfo: companyInfo || undefined,
        additionalContext: instructionText || undefined,
      });
      setCoverLetter(letter);
      setChatHistory([]);
      setInstructionText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnswerLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!instructionText.trim() || isRefining) return;
    const instruction = instructionText.trim();
    setInstructionText("");
    setChatHistory((prev) => [...prev, instruction]);
    setIsRefining(true);
    try {
      const refined = await refineCoverLetter(coverLetter, instruction);
      setCoverLetter(refined);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefining(false);
    }
  };

  const handleInstructionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && coverLetter) {
      e.preventDefault();
      handleRefine();
    }
  };

  const isLoading = isAnswerLoading || isRefining;

  return (
    <div className="w-full sm:w-[800px] h-auto bg-[var(--surface-color)] border border-[var(--border-color)] border-t-3 border-t-blue-500 rounded-2xl drop-shadow-x1 z-5">
      {/* Header */}
      <div className="bg-blue-500/20 px-5 py-5 rounded-t-2xl border-b-3 border-b-[var(--border-color)]">
        <h2 className="text-[28px] font-bold">{t("cover_letter.title")}</h2>
        <p className="text-white/50">{t("cover_letter.subtitle")}</p>
      </div>

      <form onSubmit={handleGenerateCoverLetter} className="w-full h-full flex flex-col">

        {/* Company info */}
        <div className="flex flex-col px-5 pt-4 pb-2 w-full gap-2">
          <span className="font-bold">{t("cover_letter.company_info")}</span>
          <div className="flex gap-2 overflow-hidden">
            <input
              type="text"
              readOnly
              value={companyName}
              className="flex-1 min-w-0 border focus:outline-none rounded-md border-white/20 px-3 py-2 bg-white/5"
            />
            <button
              type="button"
              onClick={handleGetCompanyInfo}
              disabled={isCompanyInfoLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isCompanyInfoLoading ? t("common.loading") : t("cover_letter.get_info")}
            </button>
          </div>
          {companyInfo && (
            <textarea
              readOnly
              value={companyInfo}
              rows={5}
              className="border focus:outline-none rounded-md border-white/20 pl-3 pt-2 bg-white/5 resize-none"
            />
          )}
        </div>

        {/* Unified letter + instructions block */}
        <div className="flex flex-col mx-5 my-3 border border-white/10 rounded-xl overflow-hidden">

          {/* Letter textarea — shown only after generation */}
          {coverLetter && (
            <>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={12}
                className="w-full border-none focus:outline-none px-4 pt-3 pb-2 bg-transparent resize-none text-white/90 text-sm"
              />

              {/* Chat history */}
              {chatHistory.length > 0 && (
                <div className="flex flex-col gap-2 max-h-36 overflow-y-auto px-3 pb-2">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className="flex justify-end">
                      <span className="bg-blue-600/30 text-blue-200 text-sm px-3 py-1.5 rounded-xl max-w-[85%]">
                        {msg}
                      </span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}

              <div className="h-px bg-white/10 mx-3" />
            </>
          )}

          {/* Instruction input — always visible, changes role based on state */}
          <div className="flex flex-col px-3 py-2 gap-1">
            <span className="text-white/35 text-[11px] uppercase tracking-wider font-semibold">
              {coverLetter ? t("cover_letter.refine_title") : t("cover_letter.additional_context")}
            </span>
            <textarea
              rows={2}
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              onKeyDown={handleInstructionKeyDown}
              placeholder={
                coverLetter
                  ? t("cover_letter.refine_placeholder")
                  : t("cover_letter.additional_context_placeholder")
              }
              disabled={isLoading}
              className="w-full border-none focus:outline-none bg-transparent text-white text-sm resize-none disabled:opacity-50 placeholder:text-white/25"
            />
          </div>
        </div>

        {/* Download row — shown after generation */}
        {coverLetter && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-5 pb-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="flex-1 border focus:outline-none rounded-md border-white/20 px-3 py-2 bg-white/5 text-white text-sm"
            />
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 whitespace-nowrap"
            >
              {t("common.download_pdf")}
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex m-3 self-end gap-3">
          {isLoading ? (
            <LoadingButton />
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-[var(--surface-color)] border border-[var(--border-color)] cursor-pointer text-white px-6 py-2 rounded-lg"
              >
                {t("cover_letter.skip")}
              </button>
              {coverLetter && (
                <button
                  type="button"
                  onClick={handleRefine}
                  disabled={!instructionText.trim()}
                  className="bg-blue-400/20 border border-blue-400/40 hover:bg-blue-400/30 text-blue-300 px-6 py-2 cursor-pointer rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("cover_letter.refine_btn")}
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-500 shadow-2xl shadow-blue-500/50 text-white px-6 py-2 cursor-pointer rounded-lg hover:-translate-y-1 transition-all duration-200"
              >
                {t("cover_letter.generate")}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
