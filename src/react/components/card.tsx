import type { cardProps } from "../../types/types";

export function JobCard({
  idTime,
  companyName,
  position = "position no data",
  //email : string,
  DeleteCardFunc,
  setDraggedCardTimeId,
}: cardProps) {
  return (
    <div
      draggable={true}
      onDragStart={() => {
        setDraggedCardTimeId(idTime);
        console.log("onDragStart");
      }}
      onDragOver={(e) => {
        e.preventDefault();
        console.log("Card DragOver");
      }}
      className="flex flex-col max-w-full pt-3 h-50 bg-[#FFFFFF] rounded-md drop-shadow-md"
    >
      <div className="flex flex-col pl-3">
        <p className="font-bold text-[22px] w-full">{companyName}</p>
        <p>{position}</p>
        <p className="pt-4 ">
          <span className="text-gray-500">Applied:</span>
          {idTime.toDateString()}
        </p>
      </div>
      <button
        onClick={() => DeleteCardFunc(idTime)}
        className="mt-auto w-full py-2 border-t-2 cursor-pointer duration-300 hover:bg-red-800  border-gray-200"
      >
        DEl
      </button>
    </div>
  );
}
