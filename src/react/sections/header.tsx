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

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setUser, setIsGuest } from "@/store/userSlice";
import { setCards } from "@/store/jobsCardArraySlice";
import { supabaseClient } from "@/supabase";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isGuest = useSelector((state: RootState) => state.User.isGuest);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    dispatch(setUser({} as User));
    dispatch(setIsGuest(false));
    dispatch(setCards([]));
    navigate("/login");
  };

  return (
    <>
    {isGuest && (
      <div className="flex items-center justify-between px-6 py-2 bg-blue-600/20 border-b border-blue-500/30 text-sm">
        <span className="text-blue-300">Demo mode — your data is saved locally and will be lost if you clear your browser.</span>
        <button
          onClick={() => navigate("/login")}
          className="ml-4 text-white bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded-lg font-semibold transition duration-200 cursor-pointer whitespace-nowrap"
        >
          Sign up to save
        </button>
      </div>
    )}
    <header className="flex place-content-between px-10 items-center border-b border-b-[var(--border-color)] py-3 bg-[var(--main-color)]">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-4 cursor-pointer"
      >
        <IconLogo className="inline sm:inline"></IconLogo>
        <h1 className="hidden sm:block text-[32px] font-bold">
          Job<span className="text-[#2563EB]">Helper</span>
        </h1>
      </div>
      <div className="flex items-center gap-5">
        {isHomePage && (
          <button
            type="button"
            onClick={() => {
              console.log("BUTTON CLICKED");
              navigate("/add-job?step=1");
            }}
            /* onClick={() => setPopupShowed(true)} */
            id="onboarding-add-btn"
            className="text-white bg-blue-400 py-2 px-5 rounded-xl font-bold text-[18px] transiton duration-400 hover:scale-105 cursor-pointer"
          >
            + <span className="hidden sm:inline ">Add new Aplication</span>
          </button>
        )}

        <div id="onboarding-avatar">
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
              <DropdownMenuItem onClick={() => isGuest ? setShowDemoModal(true) : navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              {/*           <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>

        {/* <UserAvatar className="hidden sm:inline" /> */}
      </div>
    </header>
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 w-[90%] max-w-sm flex flex-col gap-4 shadow-xl">
            <h2 className="text-xl font-bold">Demo mode</h2>
            <p className="text-white/60 text-sm">
              Profile settings are not available in demo mode. Create an account to save your resume, profile info, and cover letters.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-white/70 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowDemoModal(false); navigate("/login"); }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
