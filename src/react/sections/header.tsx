import IconLogo from "../../assets/puzzle-jigsaw-svgrepo-com.svg?react";

export function Header({
  setPopupShowed,
}: {
  setPopupShowed: (state: boolean) => void;
}) {
  return (
    <header className="flex place-content-between px-10 items-center border-b border-b-[var(--border-color)] py-3 bg-[var(--main-color)]">
      <div className="flex items-center gap-4">
        <IconLogo></IconLogo>
        <h1 className="text-[32px] font-bold">
          Job<span className="text-[#2563EB]">Helper</span>
        </h1>
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={() => setPopupShowed(true)}
          className="text-white bg-blue-400 py-2 px-5 rounded-xl font-bold text-[18px] transiton duration-400 hover:scale-105 cursor-pointer"
        >
          <img src="" alt="" />+ Add new Aplication
        </button>

        <img
          src="src/assets/avatar-girl-svgrepo-com.svg"
          alt="user account avatar image"
        />
      </div>
    </header>
  );
}
