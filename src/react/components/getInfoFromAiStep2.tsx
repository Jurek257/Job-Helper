import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateCoverLetter } from "@/services/generateCoverLetter";
import { refineCoverLetter } from "@/services/refineCoverLetter";
import type { GenerateCoverLetterParams, ChatMessage } from "@/types/types";
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

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [fileName, setFileName] = useState(`cover-letter-${companyName}`);

  // Какой индекс сообщения сейчас редактируется (null = никакой)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const lastAiIndex = [...messages].map((m) => m.role).lastIndexOf("ai");
  const lastAiMessage = lastAiIndex !== -1 ? messages[lastAiIndex] : null;
  const hasCoverLetter = !!lastAiMessage;

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
  }, [messages, isLoading]);

  const handleDownloadPDF = () => {
    if (!lastAiMessage) return;
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
    const lines = doc.splitTextToSize(lastAiMessage.content, maxWidth);
    doc.text(lines, margin, margin + 15);
    doc.save(`${fileName}.pdf`);
  };

  const handleGenerateCoverLetter = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const letter = await generateCoverLetter({
        resumeURL,
        jobTitle,
        companyName,
        jobDescription,
        additionalContext: inputText || undefined,
      });
      setMessages([{ role: "ai", content: letter }]);
      setInputText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !hasCoverLetter) return;
    const instruction = inputText.trim();
    setInputText("");
    const withUserMsg: ChatMessage[] = [...messages, { role: "user", content: instruction }];
    setMessages(withUserMsg);
    setIsLoading(true);
    try {
      const refined = await refineCoverLetter(withUserMsg, instruction);
      setMessages((prev) => [...prev, { role: "ai", content: refined }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && hasCoverLetter && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Открываем режим редактирования для сообщения по индексу
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(messages[index].content);
  };

  // Сохраняем изменённый текст обратно в массив messages
  const saveEdit = () => {
    if (editingIndex === null) return;
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === editingIndex ? { ...msg, content: editingText } : msg
      )
    );
    setEditingIndex(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
  };

  return (
    <div className="w-full sm:w-[800px] bg-[var(--surface-color)] border border-[var(--border-color)] border-t-3 border-t-blue-500 rounded-2xl drop-shadow-x1 z-5 flex flex-col">
      {/* Шапка */}
      <div className="bg-blue-500/20 px-5 py-5 rounded-t-2xl border-b border-b-[var(--border-color)]">
        <h2 className="text-[28px] font-bold">{t("cover_letter.title")}</h2>
        <p className="text-white/50">{t("cover_letter.subtitle")}</p>
      </div>

      <form onSubmit={handleGenerateCoverLetter} className="w-full flex flex-col flex-1">

        {/* Область чата */}
        <div className="flex flex-col gap-5 mx-5 mt-4 mb-3 border border-white/10 rounded-xl overflow-y-auto min-h-[120px] max-h-[520px] p-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-full text-white/25 text-sm select-none py-6">
              {t("cover_letter.additional_context_placeholder")}
            </div>
          )}

          {messages.map((msg, i) => {
            const isLastAi = i === lastAiIndex;
            const isEditing = editingIndex === i;

            if (msg.role === "ai") {
              return (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                      <span>✦</span>
                      <span>AI</span>
                    </div>
                    {/* Кнопка редактировать — только когда не редактируем */}
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEditing(i)}
                        className="text-white/25 hover:text-white/60 transition-colors text-xs px-2 py-0.5 rounded hover:bg-white/5"
                      >
                        ✎ Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    // Режим редактирования: textarea вместо div
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={14}
                        autoFocus
                        className="w-full bg-white/5 border border-blue-400/40 rounded-xl px-4 py-3 text-sm text-white/90 resize-none focus:outline-none focus:border-blue-400/70 leading-relaxed"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="text-white/50 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="bg-blue-500/80 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Обычный режим: просто текст
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  )}

                  {/* Скачать PDF — только у последнего AI-сообщения, не в режиме редактирования */}
                  {isLastAi && !isEditing && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="flex-1 border focus:outline-none rounded-md border-white/20 px-3 py-1.5 bg-white/5 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5 text-xs whitespace-nowrap"
                      >
                        {t("common.download_pdf")}
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            // Сообщение юзера — справа
            return (
              <div key={i} className="flex justify-end gap-2 items-start">
                {editingIndex === i ? (
                  <div className="flex flex-col gap-2 w-full max-w-[75%]">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={3}
                      autoFocus
                      className="w-full bg-blue-600/20 border border-blue-400/40 rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-blue-400/70"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-white/50 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="bg-blue-500/80 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEditing(i)}
                      className="text-white/20 hover:text-white/50 transition-colors text-xs mt-1.5 shrink-0"
                    >
                      ✎
                    </button>
                    <div className="bg-blue-600/30 text-blue-200 text-sm px-4 py-2.5 rounded-2xl max-w-[75%]">
                      {msg.content}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* Анимация загрузки */}
          {isLoading && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <span>✦</span>
                <span>AI</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-fit">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="flex flex-col mx-5 mb-3 border border-white/10 rounded-xl overflow-hidden">
          <div className="flex flex-col px-3 py-2 gap-1">
            <span className="text-white/35 text-[11px] uppercase tracking-wider font-semibold">
              {hasCoverLetter
                ? t("cover_letter.refine_title")
                : t("cover_letter.additional_context")}
            </span>
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasCoverLetter
                  ? t("cover_letter.refine_placeholder")
                  : t("cover_letter.additional_context_placeholder")
              }
              disabled={isLoading}
              className="w-full border-none focus:outline-none bg-transparent text-white text-sm resize-none disabled:opacity-50 placeholder:text-white/25"
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex m-3 self-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={isLoading}
            className="bg-[var(--surface-color)] border border-[var(--border-color)] cursor-pointer text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {t("cover_letter.skip")}
          </button>

          {hasCoverLetter && (
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="bg-blue-400/20 border border-blue-400/40 hover:bg-blue-400/30 text-blue-300 px-6 py-2 cursor-pointer rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("cover_letter.refine_btn")}
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 shadow-2xl shadow-blue-500/50 text-white px-6 py-2 cursor-pointer rounded-lg hover:-translate-y-1 transition-all duration-200 disabled:opacity-50"
          >
            {t("cover_letter.generate")}
          </button>
        </div>
      </form>
    </div>
  );
}
