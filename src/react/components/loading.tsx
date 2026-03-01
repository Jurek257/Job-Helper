export function LoadingButton() {
  return (
    <div className="flex text-white bg-indigo-500 gap-4 px-4 py-2 rounded-lg drop-shadow-md items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-white"></div>{" "}
      Loading...
    </div>
  );
}
