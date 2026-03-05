import { JobCard } from "../components/card";
import { Tabs } from "./Tabs";
import type { CardValue, CardStatus } from "../../types/types";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useCardActions } from "../../hooks/useCardActions";


interface DashboardProps {
  //CardsArr: CardValue[];
 // deleteJobCard: (card_id: string) => void;
  //changeCardstatus: (targetIdCard: string, targetStatus: CardStatus) => void;
}

export function Dashboard({
  //CardsArr: jobJSdataArr,
 // deleteJobCard: deleteJobCard,
  //changeCardstatus,
}: DashboardProps) {
const {deleteJobCard ,changeCardstatus } = useCardActions();
const CardsArr = useSelector((state : RootState) => state.Cards.cardDataArr);

  const [showedColumn, setShowedColumn] = useState<CardStatus>("applied");
  const draggedCardTimeId = useSelector(
    (state: RootState) => state.draggedIdCard.draggedCardId,
  );
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
            changeCardstatus(draggedCardTimeId!, "applied");
            console.log("onDrop");
          }}
          className={`sm:flex flex-col max-w-full gap-y-2 ${showedColumn === "applied" ? "flex" : "hidden"}`}
        >
          <div className="flex gap-4"></div>

          <div className="grid gap-2">
            {CardsArr
              .filter((item) => item.status === "applied")
              .map((item) => (
                <JobCard
                key={item.card_id}

                  className="border-t-blue-500"
                  id_time={item.id_time}
                  card_id={item.card_id}
                  status={item.status}
                  company_name={item.company_name}
                  position={item.position}
                  DeleteCardFunc={deleteJobCard}
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
            changeCardstatus(draggedCardTimeId!, "rejected");
            console.log("onDrop");
          }}
          className={`sm:flex flex-col max-w-full gap-y-2 ${showedColumn === "rejected" ? "flex" : "hidden"}`}
        >
          <div className="flex gap-4"></div>

          <div className="grid gap-2">
            {CardsArr
              .filter((item) => item.status === "rejected")
              .map((item) => (
                <JobCard
                key={item.card_id}

                  className="border-t-red-500"
                  id_time={item.id_time}
                  card_id={item.card_id}
                  status={item.status}
                  company_name={item.company_name}
                  position={item.position}
                  DeleteCardFunc={deleteJobCard}
                  /*    setDraggedCardId={setDraggedCardTimeId} */
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
            changeCardstatus(draggedCardTimeId!, "interview");
            console.log("onDrop");
          }}
          className={` sm:flex flex-col max-w-full gap-y-2 ${showedColumn === "interview" ? "flex" : "hidden"}`}
        >
          <div className="flex gap-4"></div>

          <div className="grid gap-2">
            {CardsArr
              .filter((item) => item.status === "interview")
              .map((item) => (
                <JobCard
                key={item.card_id}
                  className="border-t-green-500"
                  id_time={item.id_time}
                  card_id={item.card_id}
                  status={item.status}
                  company_name={item.company_name}
                  position={item.position}
                  DeleteCardFunc={deleteJobCard}
                  /*   setDraggedCardId={setDraggedCardTimeId} */
                />
              ))}
          </div>
        </section>
      </main>
    </>
  );
}
