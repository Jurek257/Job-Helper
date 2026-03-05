import type { CardStatus } from "../../types/types";

interface TabsProps {
  showedColumn: CardStatus;
  setShowedColumn: (state: CardStatus) => void;
}

export function Tabs({ showedColumn, setShowedColumn }: TabsProps) {
  return (
    <div className="grid grid-cols-3">
      <div
        onClick={() => setShowedColumn("applied")}
        className={`flex flex-col sm:flex-row  items-center border border-[var(--border-color)] ${showedColumn === "applied" ? "bg-blue-500/50" : "bg-transparent"} sm:bg-transparent justify-between px-6 py-3`}
      >
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex w-3 h-3 bg-blue-500 shadow-[0_0_10px_8px_rgba(59,130,246,0.5)] rounded-full"></div>
          <p className="text-[#FFFFFF] text-[16px] font-bold">Applied</p>
        </div>

        <div className="w-6 h-6 bg-[var(--surface-color)] rounded-md text-center text-white/50 border border-[var(--border-color)]">
          7
        </div>
      </div>

      <div
        onClick={() => setShowedColumn("rejected")}
        className={`flex flex-col sm:flex-row  items-center border border-[var(--border-color)] ${showedColumn === "rejected" ? "bg-red-500/50" : "bg-transparent"} sm:bg-transparent justify-between px-6 py-3`}
      >
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex w-3 h-3 bg-red-500 shadow-[0_0_10px_8px_rgba(239,68,68,0.5)] rounded-full"></div>
          <p className="text-[#FFFFFF] text-[16px] font-bold">Rejected</p>
        </div>

        <div className="w-6 h-6 bg-[var(--surface-color)] rounded-md text-center text-white/50 border border-[var(--border-color)]">
          7
        </div>
      </div>

      <div
        onClick={() => setShowedColumn("interview")}
        className={`flex flex-col sm:flex-row  items-center border border-[var(--border-color)] ${showedColumn === "interview" ? "bg-green-500/50" : "bg-transparent"} sm:bg-transparent justify-between px-6 py-3`}
      >
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex w-3 h-3 bg-green-500 shadow-[0_0_10px_8px_rgba(34,197,94,0.5)] rounded-full"></div>
          <p className="text-[#FFFFFF] text-[16px] font-bold">Interview</p>
        </div>

        <div className="w-6 h-6 bg-[var(--surface-color)] rounded-md text-center text-white/50 border border-[var(--border-color)]">
          7
        </div>
      </div>
    </div>
  );
}
