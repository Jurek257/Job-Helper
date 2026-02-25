import { JobCard } from "../components/card";
import type { cardProps, CardStatus } from "../../types/types";

interface DashboardProps {
  jobJSdataArr: cardProps[];
  DeleteCardFunc: (idTimeToDelete: Date) => void;
  setDraggedCardTimeId: (dateId: Date) => void;
  changeCardstatus: (
    targetIdTime: Date | undefined,
    targetStatus: CardStatus,
  ) => void;
  draggedCardTimeId: Date | undefined;
}

export function Dashboard({
  jobJSdataArr,
  DeleteCardFunc,
  setDraggedCardTimeId,
  changeCardstatus,
  draggedCardTimeId,
}: DashboardProps) {
  return (
    <main className="grid grid-cols-3 grid-cols-[2fr_2fr_1fr] gap-6 mt-5 mx-5">
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
        <div className="flex bg-blue-800 justify-center rounded-md px-6 py-3 ">
          <p className="text-[#FFFFFF] text-[16px] font-bold">Applied</p>
        </div>
        <div className="flex gap-4"></div>

        <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] ">
          {jobJSdataArr
            .filter((item) => item.status === "applied")
            .map((item) => (
              <JobCard
                idTime={item.idTime}
                status={item.status}
                companyName={item.companyName}
                position={item.position}
                DeleteCardFunc={DeleteCardFunc}
                setDraggedCardTimeId={setDraggedCardTimeId}
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
        <div className="flex bg-red-800 justify-center rounded-md px-6 py-3 ">
          <p className="text-[#FFFFFF] text-[16px] font-bold">Rejected</p>
        </div>
        <div className="flex gap-4"></div>

        <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] ">
          {jobJSdataArr
            .filter((item) => item.status === "rejected")
            .map((item) => (
              <JobCard
                idTime={item.idTime}
                status={item.status}
                companyName={item.companyName}
                position={item.position}
                DeleteCardFunc={DeleteCardFunc}
                setDraggedCardTimeId={setDraggedCardTimeId}
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
        <div className="flex bg-green-800 justify-center rounded-md px-6 py-3 ">
          <p className="text-[#FFFFFF] text-[16px] font-bold">Interview</p>
        </div>
        <div className="flex gap-4"></div>

        <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] ">
          {jobJSdataArr
            .filter((item) => item.status === "interview")
            .map((item) => (
              <JobCard
                idTime={item.idTime}
                status={item.status}
                companyName={item.companyName}
                position={item.position}
                DeleteCardFunc={DeleteCardFunc}
                setDraggedCardTimeId={setDraggedCardTimeId}
              />
            ))}

          {/* <JobCard
                idTime={new Date()}
                status='applied'
                companyName='Hmax'
                position='Director'
                DeleteCardFunc={DeleteCardFunc}
                setDraggedCardTimeId={setDraggedCardTimeId}
              /> */}
        </div>
      </section>
    </main>
  );
}
