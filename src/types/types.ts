export interface CardValue {
  id_time: Date;
  status: CardStatus;
  company_name: string;
  position?: string;
  email?: string;
  card_id: string;
}

export interface CardProps {
  DeleteCardFunc: (card_id: string) => void;
  setDraggedCardTimeId: (dateId: Date) => void;
}

export type CardStatus = "applied" | "rejected" | "interview";
