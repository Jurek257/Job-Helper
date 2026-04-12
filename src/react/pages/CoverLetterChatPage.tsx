import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/react/sections/header";
import {
  getChat,
  getUserChats,
  updateChatMessages,
  deleteChat,
  sendChatMessage,
} from "@/services/coverLetterChatService";
import type { ChatMessage, CoverLetterChat } from "@/types/types";
import jsPDF from "jspdf";
import { MessageSquare, Plus, Trash2, Download, PanelLeft } from "lucide-react";
import { supabaseClient } from "@/supabase";

export function CoverLetterChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const [currentChat, setCurrentChat] = useState<CoverLetterChat | null>(null);
  const [allChats, setAllChats] = useState<CoverLetterChat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [fileName, setFileName] = useState("cover-letter");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 640);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const lastAiIndex = [...messages].map((m) => m.role).lastIndexOf("ai");
  const lastAiMessage = lastAiIndex !== -1 ? messages[lastAiIndex] : null;
  const hasCoverLetter = !!lastAiMessage;

  // Загружаем чат и список всех чатов при смене chatId
  useEffect(() => {
    if (!chatId) return;
    setIsInitializing(true);
    setMessages([]);
    setEditingIndex(null);

    Promise.all([getChat(chatId), getUserChats()])
      .then(([chat, chats]) => {
        setCurrentChat(chat);
        setMessages(chat.messages ?? []);
        setAllChats(chats);
        setFileName(`cover-letter-${chat.company_name}`);

      })
      .catch(console.error)
      .finally(() => setIsInitializing(false));
  }, [chatId]);

  // Загружаем имя юзера для имени файла
  useEffect(() => {
    if (!currentChat) return;
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
            setFileName(`cover-letter-${currentChat.company_name}-${lastName}`);
          }
        });
    });
  }, [currentChat]);

  // Скролл вниз при новых сообщениях
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Сохраняем сообщения в Supabase и обновляем сайдбар
  const saveMessages = async (newMessages: ChatMessage[]) => {
    if (!chatId) return;
    await updateChatMessages(chatId, newMessages);
    setAllChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, messages: newMessages, updated_at: new Date().toISOString() }
          : c,
      ),
    );
  };

  // Единственная функция отправки — использует cover-letter-chat edge function
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !currentChat) return;
    const userText = inputText.trim();
    setInputText("");

    // Сразу добавляем сообщение юзера — видно мгновенно
    const withUserMsg: ChatMessage[] = [...messages, { role: "user", content: userText }];
    setMessages(withUserMsg);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage({
        messages: withUserMsg,
        jobTitle: currentChat.job_title,
        companyName: currentChat.company_name,
        jobDescription: currentChat.job_description,
        resumeURL: currentChat.resume_url,
      });
      const finalMessages: ChatMessage[] = [...withUserMsg, { role: "ai", content: reply }];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Редактирование сообщения прямо в чате
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(messages[index].content);
  };

  const saveEdit = async () => {
    if (editingIndex === null) return;
    const newMessages = messages.map((msg, i) =>
      i === editingIndex ? { ...msg, content: editingText } : msg,
    );
    setMessages(newMessages);
    await saveMessages(newMessages);
    setEditingIndex(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
  };

  // Удаление чата из сайдбара
  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteChat(id);
    setAllChats((prev) => prev.filter((c) => c.id !== id));
    if (id === chatId) navigate("/");
  };

  const handleDownloadPDF = () => {
    if (!lastAiMessage || !currentChat) return;
    const doc = new jsPDF({ compress: false });
    const margin = 25;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setLineHeightFactor(1.6);
    doc.setProperties({
      title: `Cover Letter - ${currentChat.company_name}`,
      subject: "Job Application Cover Letter",
      author: "JobHelper",
      keywords: " ".repeat(10000),
    });
    const lines = doc.splitTextToSize(lastAiMessage.content, maxWidth);
    doc.text(lines, margin, margin + 15);
    doc.save(`${fileName}.pdf`);
  };

  const formatDate = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return `${Math.floor(diff / 86_400_000)}d ago`;
  };

  if (isInitializing) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-white/40">Loading...</div>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-white/40">Chat not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* ─── Сайдбар ─── */}
        <aside
          className={`${sidebarOpen ? "w-60" : "w-0"} flex-shrink-0 border-r border-[var(--border-color)] bg-[var(--surface-color)] flex flex-col overflow-hidden transition-all duration-200`}
        >
          {/* Кнопка создать новый чат → возвращает на форму */}
          <div className="p-3 border-b border-[var(--border-color)]">
            <button
              onClick={() => navigate("/add-job")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>

          {/* Список чатов */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {allChats.length === 0 && (
              <p className="text-white/25 text-xs text-center py-6">No chats yet</p>
            )}
            {allChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/cover-letter/${chat.id}`)}
                className={`group flex items-start justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  chat.id === chatId
                    ? "bg-blue-500/20 text-white"
                    : "hover:bg-white/5 text-white/70"
                }`}
              >
                <div className="flex items-start gap-2 min-w-0">
                  <MessageSquare size={14} className="mt-0.5 shrink-0 opacity-50" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{chat.company_name}</div>
                    <div className="text-xs text-white/40 truncate">{chat.job_title || "—"}</div>
                    <div className="text-xs text-white/25">{formatDate(chat.updated_at)}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* ─── Основная область чата ─── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Шапка чата с названием компании */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--surface-color)]">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <PanelLeft size={18} />
            </button>
            <div>
              <div className="font-semibold">{currentChat.company_name}</div>
              {currentChat.job_title && (
                <div className="text-xs text-white/40">{currentChat.job_title}</div>
              )}
            </div>
          </div>

          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setInputText("Write me a professional cover letter based on my resume")}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-left max-w-[220px]"
                  >
                    <span className="text-blue-400 text-lg leading-none mt-0.5">✦</span>
                    <span className="text-sm text-white/70">Write me a cover letter based on my resume</span>
                  </button>
                  <button
                    onClick={() => setInputText(`Find information about ${currentChat?.company_name} and tell me what to highlight in my application`)}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-left max-w-[220px]"
                  >
                    <span className="text-blue-400 text-lg leading-none mt-0.5">✦</span>
                    <span className="text-sm text-white/70">Find info about the company for my application</span>
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, i) => {
              const isLastAi = i === lastAiIndex;
              const isEditing = editingIndex === i;

              if (msg.role === "ai") {
                return (
                  <div key={i} className="flex flex-col gap-2 max-w-3xl">
                    {/* Метка AI + кнопка Edit */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                        <span>✦</span>
                        <span>AI</span>
                      </div>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => startEditing(i)}
                          className="text-white/25 hover:text-white/60 text-xs px-2 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          ✎ Edit
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={14}
                          autoFocus
                          className="w-full bg-white/5 border border-blue-400/40 rounded-xl px-4 py-3 text-sm text-white/90 resize-none focus:outline-none leading-relaxed"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="text-white/50 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="bg-blue-500/80 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    )}

                    {/* Скачать PDF — только у последнего AI-сообщения */}
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
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg transition-all hover:-translate-y-0.5 text-xs whitespace-nowrap cursor-pointer"
                        >
                          <Download size={12} />
                          PDF
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              // Сообщение юзера — пузырь справа
              return (
                <div key={i} className="flex justify-end gap-2 items-start">
                  {isEditing ? (
                    <div className="flex flex-col gap-2 w-full max-w-[75%]">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={3}
                        autoFocus
                        className="w-full bg-blue-600/20 border border-blue-400/40 rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="text-white/50 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="bg-blue-500/80 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
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
                        className="text-white/20 hover:text-white/50 text-xs mt-2 cursor-pointer transition-colors"
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

            {/* Анимация загрузки AI */}
            {isLoading && (
              <div className="flex flex-col gap-2 max-w-3xl">
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
          <div className="border-t border-[var(--border-color)] p-4 bg-[var(--surface-color)]">
            <div className="border border-white/10 rounded-xl overflow-hidden mb-2">
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  hasCoverLetter
                    ? "Ask AI to refine the letter… (Enter to send, Shift+Enter for new line)"
                    : "Additional context for the cover letter… (optional)"
                }
                disabled={isLoading}
                className="w-full border-none focus:outline-none bg-transparent text-white text-sm resize-none disabled:opacity-50 placeholder:text-white/25 px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-[var(--surface-color)] border border-[var(--border-color)] text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:border-white/30 transition-colors"
              >
                Home
              </button>
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-blue-500 shadow-lg shadow-blue-500/30 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
