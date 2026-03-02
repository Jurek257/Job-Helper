import { JobCard } from "../components/card";
import type { CardValue, CardStatus } from "../../types/types";

interface DashboardProps {
  jobJSdataArr: CardValue[];
  DeleteCardFunc: (card_id: string) => void;
  setDraggedCardId: (card_id: string) => void;
  changeCardstatus: (targetIdCard: string, targetStatus: CardStatus) => void;
  draggedCardId: string;
}

export function Dashboard({
  jobJSdataArr,
  DeleteCardFunc,
  setDraggedCardId: setDraggedCardTimeId,
  changeCardstatus,
  draggedCardId: draggedCardTimeId,
}: DashboardProps) {
  return (
    <main className="grid grid-cols-3 divide-x divide-[var(--border-color)] min-h-screen">
      <section
        onDragOver={(e) => {
          e.preventDefault();
          console.log("onDragOver");
        }}
        onDrop={() => {
          changeCardstatus(draggedCardTimeId, "applied");
          console.log("onDrop");
        }}
        className=" flex flex-col max-w-full gap-y-2"
      >
        <div className="flex items-center border-b border-b-[var(--border-color)]  justify-between rounded-md px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 shadow-[0_0_10px_8px_rgba(59,130,246,0.5)] rounded-full"></div>
            <p className="text-[#FFFFFF] text-[16px] font-bold">Applied</p>
          </div>

          <div className="w-6 h-6 bg-[var(--surface-color)] rounded-md text-center text-white/50 border border-[var(--border-color)]">
            7
          </div>
        </div>
        <div className="flex gap-4"></div>

        <div className="grid gap-2">
          {jobJSdataArr
            .filter((item) => item.status === "applied")
            .map((item) => (
              <JobCard
                id_time={item.id_time}
                card_id={item.card_id}
                status={item.status}
                company_name={item.company_name}
                position={item.position}
                DeleteCardFunc={DeleteCardFunc}
                setDraggedCardId={setDraggedCardTimeId}
              />
            ))}
        </div>
      </section>

      <section
        onDragOver={(e) => {
          e.preventDefault();
          console.log("onDragOver");
        }}
        onDrop={() => {
          changeCardstatus(draggedCardTimeId, "rejected");
          console.log("onDrop");
        }}
        className=" flex flex-col max-w-full gap-y-2"
      >
        {/* <div className="flex  justify-center items-center border-b border-b-[var(--border-color)] gap-2 rounded-md px-6 py-3">
          <div className="w-3 h-3 bg-red-500 shadow-[0_0_10px_8px_rgba(239,68,68,0.5)] rounded-full"></div>
          <p className="text-[#FFFFFF] text-[16px] font-bold">Rejected</p>
        </div> */}
        <div className="flex items-center border-b border-b-[var(--border-color)]  justify-between rounded-md px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 shadow-[0_0_10px_8px_rgba(239,68,68,0.5)] rounded-full"></div>
            <p className="text-[#FFFFFF] text-[16px] font-bold">Rejected</p>
          </div>

          <div className="w-6 h-6 bg-[var(--surface-color)] rounded-md text-center text-white/50 border border-[var(--border-color)]">
            7
          </div>
        </div>
        <div className="flex gap-4"></div>

        <div className="grid gap-2">
          {jobJSdataArr
            .filter((item) => item.status === "rejected")
            .map((item) => (
              <JobCard
                id_time={item.id_time}
                card_id={item.card_id}
                status={item.status}
                company_name={item.company_name}
                position={item.position}
                DeleteCardFunc={DeleteCardFunc}
                setDraggedCardId={setDraggedCardTimeId}
              />
            ))}
        </div>
      </section>

      <section
        onDragOver={(e) => {
          e.preventDefault();
          console.log("onDragOver");
        }}
        onDrop={() => {
          changeCardstatus(draggedCardTimeId, "interview");
          console.log("onDrop");
        }}
        className=" flex flex-col max-w-full gap-y-2"
      >
        {/* <div className="flex  justify-center items-center border-b border-b-[var(--border-color)] gap-2 rounded-md px-6 py-3">
          <div className="w-3 h-3 bg-green-500 shadow-[0_0_10px_8px_rgba(34,197,94,0.5)] rounded-full"></div>
          <p className="text-[#FFFFFF] text-[16px] font-bold">Interview</p>
        </div> */}
        <div className="flex items-center border-b border-b-[var(--border-color)]  justify-between rounded-md px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 shadow-[0_0_10px_8px_rgba(34,197,94,0.5)] rounded-full"></div>
            <p className="text-[#FFFFFF] text-[16px] font-bold">Interview</p>
          </div>

          <div className="w-6 h-6 bg-[var(--surface-color)] rounded-md text-center text-white/50 border border-[var(--border-color)]">
            7
          </div>
        </div>
        <div className="flex gap-4"></div>

        <div className="grid gap-2">
          {jobJSdataArr
            .filter((item) => item.status === "interview")
            .map((item) => (
              <JobCard
                id_time={item.id_time}
                card_id={item.card_id}
                status={item.status}
                company_name={item.company_name}
                position={item.position}
                DeleteCardFunc={DeleteCardFunc}
                setDraggedCardId={setDraggedCardTimeId}
              />
            ))}
        </div>
      </section>
    </main>
  );
}
