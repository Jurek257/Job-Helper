import type { CardStatus } from "../../types/types";

interface TabsProps {
  setShowedColumn: (state: CardStatus) => void;
}

export function Tabs({ setShowedColumn }: TabsProps) {
setShowedColumn;
  return (
    <div className="grid grid-cols-3">

<div onClick={() => setShowedColumn('applied')} className="flex flex-col sm:flex-row  items-center border border-[var(--border-color)]  justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex w-3 h-3 bg-blue-500 shadow-[0_0_10px_8px_rgba(59,130,246,0.5)] rounded-full"></div>
              <p className="text-[#FFFFFF] text-[16px] font-bold">Applied</p>
            </div>

            <div className="w-6 h-6 bg-[var(--surface-color)] rounded-md text-center text-white/50 border border-[var(--border-color)]">
              7
            </div>
          </div>

<div onClick={() => setShowedColumn('rejected')} className="flex flex-col sm:flex-row items-center border border-[var(--border-color)]  justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex w-3 h-3 bg-red-500 shadow-[0_0_10px_8px_rgba(239,68,68,0.5)] rounded-full"></div>
              <p className="text-[#FFFFFF] text-[16px] font-bold">Rejected</p>
            </div>

            <div className="w-6 h-6 bg-[var(--surface-color)] rounded-md text-center text-white/50 border border-[var(--border-color)]">
              7
            </div>
          </div>  

 <div onClick={() => setShowedColumn('interview')} className="flex flex-col sm:flex-row items-center border border-[var(--border-color)]  justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex w-3 h-3 bg-green-500 shadow-[0_0_10px_8px_rgba(34,197,94,0.5)] rounded-full"></div>
              <p className="text-[#FFFFFF] text-[16px] font-bold">Interview</p>
            </div>

            <div className="w-6 h-6 bg-[var(--surface-color)] rounded-md text-center text-white/50 border border-[var(--border-color)]">
              7
            </div>
          </div>


      {/* <div className="flex flex-col w-full h-20 justify-center items-center rounded-xl border border-[var(--border-color)]">
        <span className="text-[22px]">4</span>
        <span className="text-white/50 font-bold">Applied</span>
      </div><div className="flex flex-col w-full h-20 justify-center items-center rounded-xl border border-[var(--border-color)]">
        <span className="text-[22px]">4</span>
        <span className="text-white/50 font-bold">Applied</span>
      </div><div className="flex flex-col w-full h-20 justify-center items-center rounded-xl border border-[var(--border-color)]">
        <span className="text-[22px]">4</span>
        <span className="text-white/50 font-bold">Applied</span>
      </div> */}
    </div>
  );
}
