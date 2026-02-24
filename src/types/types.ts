export interface cardProps {
  idTime: Date;
  companyName: string;
  position?: string;
  email?: string;
  DeleteCardFunc: (idTimeToDelete: Date) => void;
}
