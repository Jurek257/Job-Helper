import { JobCard } from "../components/card";
import { Tabs } from "./Tabs";
import type { CardValue, CardStatus } from "../../types/types";
import { useState } from "react";

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
  const [showedColumn, setShowedColumn] = useState<CardStatus>("applied");

  return (
    <>
      <Tabs showedColumn={showedColumn} setShowedColumn={setShowedColumn} />

      <main className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-[var(--border-color)] min-h-screen">
        <section
          onDragOver={(e) => {
            e.preventDefault();
            console.log("onDragOver");
          }}
          onDrop={() => {
            changeCardstatus(draggedCardTimeId, "applied");
            console.log("onDrop");
          }}
          className={`sm:flex flex-col max-w-full gap-y-2 ${showedColumn === "applied" ? "flex" : "hidden"}`}
        >
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
          className={`sm:flex flex-col max-w-full gap-y-2 ${showedColumn === "rejected" ? "flex" : "hidden"}`}
        >
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
          className={` sm:flex flex-col max-w-full gap-y-2 ${showedColumn === "interview" ? "flex" : "hidden"}`}
        >
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
    </>
  );
}
