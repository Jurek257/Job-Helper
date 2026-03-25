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
