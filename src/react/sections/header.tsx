import IconLogo from "../../assets/puzzle-jigsaw-svgrepo-com.svg?react";

export function Header({setPopupShowed} : {setPopupShowed : (state : boolean) => void }) {
  return (
    <header className="flex place-content-between px-10 items-center py-3 bg-[#FFFFFF] drop-shadow-lg">
      <div className="flex items-center gap-4">
        <IconLogo></IconLogo>
        <h1 className="text-[32px] font-bold">
          Job<span className="text-[#2563EB]">Helper</span>
        </h1>
      </div>

      <button onClick={() => setPopupShowed(true) } className="text-blue-800 font-bold text-[26px] transiton-500 hover:underline hover:text-blue-500 cursor-pointer">
        <img src="" alt="" />
        Add new Aplication
      </button>

      <img
        src="src/assets/avatar-girl-svgrepo-com.svg"
        alt="user account avatar image"
      />
    </header>
  );
}
