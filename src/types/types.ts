export interface cardProps {
  idTime: Date;
  status: CardStatus;
  companyName: string;
  position?: string;
  email?: string;
  DeleteCardFunc: (idTimeToDelete: Date) => void;
  setDraggedCardTimeId: (dateId: Date) => void;
}

export type CardStatus = "applied" | "rejected" | "interview";
