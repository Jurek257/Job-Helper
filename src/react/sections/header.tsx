import IconLogo from "../../assets/puzzle-jigsaw-svgrepo-com.svg?react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useNavigate, useLocation } from "react-router-dom";

export function Header({
  setPopupShowed,
}: {
  setPopupShowed: (state: boolean) => void;
}) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();

  return (
    <header className="flex place-content-between px-10 items-center border-b border-b-[var(--border-color)] py-3 bg-[var(--main-color)]">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-4 cursor-pointer"
      >
        <IconLogo className="hidden sm:inline"></IconLogo>
        <h1 className="text-[32px] font-bold">
          Job<span className="text-[#2563EB]">Helper</span>
        </h1>
      </div>
      <div className="flex items-center gap-5">
        {isHomePage && (
          <button
            onClick={() => setPopupShowed(true)}
            className="text-white bg-blue-400 py-2 px-5 rounded-xl font-bold text-[18px] transiton duration-400 hover:scale-105 cursor-pointer"
          >
            + <span className="hidden sm:inline ">Add new Aplication</span>
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="destructive" size="icon" className="rounded-full">
              <Avatar size="lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              {/*           <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <UserAvatar className="hidden sm:inline" /> */}
      </div>
    </header>
  );
}
