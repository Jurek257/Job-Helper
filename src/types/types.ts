export interface CardValue {
  id_time: Date;
  status: CardStatus;
  company_name: string;
  position?: string;
  email?: string;
card_id: string;
}

export interface CardProps {
  DeleteCardFunc: (idTimeToDelete: Date) => void;
  setDraggedCardTimeId: (dateId: Date) => void;
}

export type CardStatus = "applied" | "rejected" | "interview";
