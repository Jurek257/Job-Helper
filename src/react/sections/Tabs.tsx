import type { CardStatus } from "../../types/types";

interface TabsProps {
  setShowedColumn: (state: CardStatus) => void;
}

export function Tabs({ setShowedColumn }: TabsProps) {
setShowedColumn;
  return (
    <div className="grid grid-cols-3 gap-2 px-2">
      <div className="flex flex-col w-full h-20 justify-center items-center rounded-xl border border-[var(--border-color)]">
        <span className="text-[22px]">4</span>
        <span className="text-white/50 font-bold">Applied</span>
      </div><div className="flex flex-col w-full h-20 justify-center items-center rounded-xl border border-[var(--border-color)]">
        <span className="text-[22px]">4</span>
        <span className="text-white/50 font-bold">Applied</span>
      </div><div className="flex flex-col w-full h-20 justify-center items-center rounded-xl border border-[var(--border-color)]">
        <span className="text-[22px]">4</span>
        <span className="text-white/50 font-bold">Applied</span>
      </div>
    </div>
  );
}
