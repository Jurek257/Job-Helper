import type { CardValue, CardProps } from "../../types/types";
import { CardDropDownButton } from "./CardDropDownButton";

export function JobCard({
  id_time,
  company_name,
  position = "position no data",
  card_id,
  //email : string,
  className,
  DeleteCardFunc,
  setDraggedCardId,
}: CardValue & CardProps) {
  const id_timeDateObject = new Date(id_time);
  DeleteCardFunc;
  return (
    <div
      draggable={true}
      onDragStart={() => {
        setDraggedCardId(card_id);
        console.log("onDragStart");
      }}
      onDragOver={(e) => {
        e.preventDefault();
        console.log("Card DragOver");
      }}
      className={`flex justify-between max-w-full mx-[5%] pt-3 h-35 bg-[var(--surface-color)] rounded-2xl border-t-3 border-t-blue-500   border border-[var(--border-color)] ${className || ""}`}
    >
      <div className="flex flex-col">
        <div className="flex flex-col pl-3">
          <p className="font-bold text-[22px] w-full">{company_name}</p>
          <p className="text-white/50">{position}</p>
          <p className="pt-4 text-white/50">
            {id_timeDateObject.toDateString()}
          </p>
        </div>
      </div>

      <CardDropDownButton />
      {/*  <button
        onClick={() => DeleteCardFunc(card_id)}
        className="mt-auto w-full py-2 border-t-2 cursor-pointer duration-300 hover:bg-red-800  border-gray-200"
      >
        DEl
      </button> */}
    </div>
  );
}
