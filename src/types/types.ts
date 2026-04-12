export interface CardValue {
  id_time: string;
  status: CardStatus;
  company_name: string;
  position?: string;
  email?: string;
  card_id: string;
}

export interface CardProps {
  className: string;
  DeleteCardFunc: (card_id: string) => void;
  //setDraggedCardId: (card_id: string) => void;
}

export type CardStatus = "applied" | "rejected" | "interview";

export interface ProfileFormProps {
  name: string;
  occupation: string;
  resumeStorageURL: string;
}

export interface jobFormProps {
  companyName: string;
  position: string;
  PostURL: string;
  jobDescription: string;
}

export interface GenerateCoverLetterParams {
  resumeURL: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  companyInfo?: string;
  additionalContext?: string;
}

// Одно сообщение в чате
export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

// Запись чата в Supabase
export interface CoverLetterChat {
  id: string;
  user_id: string;
  job_title: string;
  company_name: string;
  job_description: string;
  resume_url: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}
