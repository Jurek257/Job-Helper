export function JobCard() {
  return (
    <div className="flex flex-col w-1/2 pt-3 h-50 bg-[#FFFFFF] rounded-md drop-shadow-md">
      <div className="flex flex-col pl-3">
        <p className="font-bold text-[22px] w-full">Hmax Software</p>
        <p>Junior Frontend Developer</p>
        <p className="pt-4 ">
          <span className="text-gray-500">Applied:</span>17.02.2026
        </p>
      </div>
      <button className="mt-auto w-full py-2 border-t-2 cursor-pointer duration-300 hover:bg-red-800  border-gray-200">
        DEl
      </button>
    </div>
  );
}
