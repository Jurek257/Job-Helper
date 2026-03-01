import type { CardValue, CardProps } from "../../types/types";

export function JobCard({
  id_time,
  company_name,
  position = "position no data",
  card_id,
  //email : string,
  DeleteCardFunc,
  setDraggedCardId,
}: CardValue & CardProps) {
  const id_timeDateObject = new Date(id_time);
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
      className="flex flex-col max-w-full pt-3 h-50 bg-[#FFFFFF] rounded-md drop-shadow-md"
    >
      <div className="flex flex-col pl-3">
        <p className="font-bold text-[22px] w-full">{company_name}</p>
        <p>{position}</p>
        <p className="pt-4 ">
          <span className="text-gray-500">Applied:</span>
          {id_timeDateObject.toDateString()}
        </p>
      </div>
      <button
        onClick={() => DeleteCardFunc(card_id)}
        className="mt-auto w-full py-2 border-t-2 cursor-pointer duration-300 hover:bg-red-800  border-gray-200"
      >
        DEl
      </button>
    </div>
  );
}
