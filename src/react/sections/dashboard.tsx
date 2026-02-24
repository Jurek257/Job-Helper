import { JobCard } from "../components/card";
import type { cardProps } from "../../types/types";

interface DashboardProps {
  jobJSdataArr: cardProps[];
  DeleteCardFunc: (idTimeToDelete: Date) => void;
}

export function Dashboard({ jobJSdataArr, DeleteCardFunc }: DashboardProps) {

  return (
    <main className="grid grid-cols-3 grid-cols-[2fr_2fr_1fr] gap-6 mt-5 mx-5">
      <section className=" flex flex-col max-w-full gap-y-2">
        <div className="flex bg-blue-800 justify-center rounded-md px-6 py-3 ">
          <p className="text-[#FFFFFF] text-[16px] font-bold">Applied</p>
        </div>
        <div className="flex gap-4"></div>

        <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] ">
          {jobJSdataArr.map((item) => (
            <JobCard
              idTime={item.idTime}
              companyName={item.companyName}
              position={item.position}
              DeleteCardFunc={DeleteCardFunc}
            />
          ))}
        </div>
      </section>

      <section className=" flex flex-col max-w-full gap-y-2">
        <div className="flex bg-red-800 justify-center rounded-md px-6 py-3 ">
          <p className="text-[#FFFFFF] text-[16px] font-bold">Rejected</p>
        </div>
        <div className="flex gap-4"></div>

        <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] ">
          {/* {jobJSdataArr.map((item) => (
            <JobCard
              idTime={item.idTime}
              companyName={item.companyName}
              position={item.position}
              DeleteCardFunc={DeleteCardFunc}
            />
          ))} */}
        </div>
      </section>

      <section className=" flex flex-col max-w-full gap-y-2">
        <div className="flex bg-green-800 justify-center rounded-md px-6 py-3 ">
          <p className="text-[#FFFFFF] text-[16px] font-bold">Interview</p>
        </div>
        <div className="flex gap-4"></div>

        <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] ">
          {/* {jobJSdataArr.map((item) => (
            <JobCard
              idTime={item.idTime}
              companyName={item.companyName}
              position={item.position}
              DeleteCardFunc={DeleteCardFunc}
            />
          ))} */}
        </div>
      </section>
    </main>
  );
}
