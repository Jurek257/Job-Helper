import { JobCard } from "../components/card";
import { useState } from "react";
import type { cardProps } from "../components/card"

export function Dashboard() {
const [cardsArray , changeCardArray] = useState<cardProps[]>([]);

const addCard = () => {changeCardArray(prev => [...prev , {idTime :  new Date(),companyName : "fdfdsaaaafd" ,position : " dffdf" }])}

  return (
    <main className="grid grid-cols-3 gap-6 mt-5 mx-5">
      <section className=" flex flex-col gap-y-2">
        <div className="flex bg-blue-800 justify-center rounded-md px-6 py-3 ">
          <p className="text-[#FFFFFF] text-[16px] font-bold">Applied</p>
        </div>

        <div className="flex gap-4">
        </div>
      </section>

      <section>
        <div className="flex bg-red-800 justify-center rounded-md px-6 py-3 ">
          <p className="text-[#FFFFFF] text-[16px] font-bold">Rejected</p>
        </div>
      </section>

      <section>
        <div className="flex bg-green-800 justify-center rounded-md px-6 py-3 ">
          <p className="text-[#FFFFFF] text-[16px] font-bold">Interview</p>
        </div>
      </section>
    </main>
  );
}
