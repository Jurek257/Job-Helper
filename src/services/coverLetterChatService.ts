import { supabaseClient } from "@/supabase";
import type { ChatMessage, CoverLetterChat } from "@/types/types";

// Создаёт новую запись чата в таблице cover_letter_chats, возвращает id
export const createChat = async (params: {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  resumeUrl: string;
}): Promise<string> => {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabaseClient
    .from("cover_letter_chats")
    .insert({
      user_id: user.id,
      job_title: params.jobTitle,
      company_name: params.companyName,
      job_description: params.jobDescription,
      resume_url: params.resumeUrl,
      messages: [],
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
};

// Обновляет массив сообщений у конкретного чата
export const updateChatMessages = async (
  chatId: string,
  messages: ChatMessage[],
): Promise<void> => {
  const { error } = await supabaseClient
    .from("cover_letter_chats")
    .update({ messages, updated_at: new Date().toISOString() })
    .eq("id", chatId);

  if (error) throw error;
};

// Загружает один чат по id
export const getChat = async (chatId: string): Promise<CoverLetterChat> => {
  const { data, error } = await supabaseClient
    .from("cover_letter_chats")
    .select("*")
    .eq("id", chatId)
    .single();

  if (error) throw error;
  return data as CoverLetterChat;
};

// Загружает все чаты текущего пользователя, отсортированные по дате обновления
export const getUserChats = async (): Promise<CoverLetterChat[]> => {
  const { data, error } = await supabaseClient
    .from("cover_letter_chats")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CoverLetterChat[];
};

// Удаляет чат по id
export const deleteChat = async (chatId: string): Promise<void> => {
  const { error } = await supabaseClient
    .from("cover_letter_chats")
    .delete()
    .eq("id", chatId);

  if (error) throw error;
};
