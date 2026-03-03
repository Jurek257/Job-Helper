import { MoreHorizontal } from "lucide-react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import type { CardStatus } from "../../types/types";

interface CardDropDownButtonProps {
  changeCardstatus: (targetCardId: string, targetStatus: CardStatus) => void;
}

export function CardDropDownButton( {changeCardstatus} : CardDropDownButtonProps) {
  return (
    <div className="flex flex-col relative ">
      <Menu>
        <MenuButton className={"outline-none"}>
          <MoreHorizontal className="opacity-50 mr-3"></MoreHorizontal>
        </MenuButton>

        <MenuItems
          className={
            "absolute flex flex-col justify-between h-25 w-30 top-[20px] right-[10px] outline-none bg-[var(--border-color)] rounded-xl border border-[var(--border-color)]"
          }
        >
          <MenuItem>
            <button
              className="flex justify-center items-center data-focus:bg-[radial-gradient(circle_at_center,_#3b82f6,_transparent)]  h-full text-center "
            >
              <div className="flex w-2 h-2 bg-blue-500 mr-2 shadow-[0_0_10px_8px_rgba(59,130,246,0.5)] rounded-full"></div>
              Applied
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="flex justify-center items-center data-focus:bg-[radial-gradient(circle_at_center,_#ef4444,_transparent)] h-full text-center "
            >
              <div className="flex w-2 h-2 bg-red-500 mr-2 shadow-[0_0_10px_8px_rgba(239,68,68,0.5)] rounded-full"></div>
              Rejected
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="flex justify-center items-center data-focus:bg-[radial-gradient(circle_at_center,_#22c55e,_transparent)] h-full text-center "
            >
              <div className="flex w-2 h-2 bg-green-500 mr-2 shadow-[0_0_10px_8px_rgba(34,197,94,0.5)] rounded-full"></div>
              Interview
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
