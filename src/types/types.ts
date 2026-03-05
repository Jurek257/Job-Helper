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
