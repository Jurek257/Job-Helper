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

import { useState, useRef, useEffect } from "react";
import { Globe, Search, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserChats } from "@/services/coverLetterChatService";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setUser, setIsGuest } from "@/store/userSlice";
import { setCards } from "@/store/jobsCardArraySlice";
import { supabaseClient } from "@/supabase";
import type { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";

// Доступные языки: код → отображаемое название
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "bn", label: "বাংলা" },
  { code: "ru", label: "Русский" },
  { code: "pt", label: "Português" },
  { code: "id", label: "Indonesia" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "sv", label: "Svenska" },
  { code: "no", label: "Norsk" },
  { code: "tr", label: "Türkçe" },
  { code: "pl", label: "Polski" },
];

export function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isGuest = useSelector((state: RootState) => state.User.isGuest);
  const user = useSelector((state: RootState) => state.User.user);
  const cards = useSelector((state: RootState) => state.Cards.cardDataArr);
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  // Поиск по карточкам
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
    ? cards.filter((c) =>
        c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  // Закрываем поиск при клике вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  };

  // t — функция перевода, i18n — объект с текущим языком и методом changeLanguage
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    // Арабский — RTL, все остальные — LTR
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  };

  const handleOpenChat = async () => {
    try {
      const chats = await getUserChats();
      if (chats.length > 0) {
        navigate(`/cover-letter/${chats[0].id}`);
      } else {
        navigate("/add-job");
      }
    } catch {
      navigate("/add-job");
    }
  };

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
      <div className="flex sm:flex-row flex-col items-center justify-between px-6 py-2 bg-blue-600/20 border-b border-blue-500/30 text-sm gap-1 sm:gap-0">
        <span className="text-blue-300 text-center sm:text-left">{t("header.demo_banner")}</span>
        <button
          onClick={() => navigate("/login")}
          className="sm:ml-4 text-white bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded-lg font-semibold transition duration-200 cursor-pointer whitespace-nowrap"
        >
          {t("header.sign_up_to_save")}
        </button>
      </div>
    )}
    <header className="flex justify-between px-3 sm:px-10 items-center border-b border-b-[var(--border-color)] py-3 bg-[var(--main-color)]">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-4 cursor-pointer"
      >
        <IconLogo className="w-[42px] h-[42px] sm:w-auto sm:h-auto"></IconLogo>
        <h1 className="hidden sm:block text-[32px] font-bold">
          Job<span className="text-[#2563EB]">Helper</span>
        </h1>
      </div>

      {/* Поиск по карточкам */}
      <div ref={searchRef} className="relative flex-1 max-w-xs mx-4">
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-[var(--surface-color)] border border-white/20 rounded-lg px-3 py-1.5">
            <Search size={15} className="text-white/40 shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies…"
              className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-white/30 min-w-0"
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-white/40 hover:text-white cursor-pointer">
              <X size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Search size={20} />
          </button>
        )}

        {/* Дропдаун с результатами */}
        {searchOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden z-50">
            {searchResults.length === 0 ? (
              <p className="px-4 py-3 text-sm text-white/40">No companies found</p>
            ) : (
              searchResults.map((card) => (
                <button
                  key={card.card_id}
                  onClick={() => { navigate("/"); setSearchOpen(false); setSearchQuery(""); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <span className="text-sm text-white font-medium truncate">{card.company_name}</span>
                  <span className="text-xs text-white/35 ml-3 shrink-0">{formatDate(card.id_time)}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Десктоп: select дропдаун */}
        <select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="hidden sm:block bg-[var(--surface-color)] border border-[var(--border-color)] text-white/70 text-sm rounded-lg px-2 py-1 cursor-pointer outline-none hover:border-white/40 transition-colors"
        >
          {LANGUAGES.map(({ code, label }) => (
            <option key={code} value={code} className="bg-[#1a1a24]">
              {label}
            </option>
          ))}
        </select>

        {/* Мобайл: иконка глобуса */}
        <button
          onClick={() => setShowLangModal(true)}
          className="sm:hidden p-2 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <Globe size={22} />
        </button>

        {isHomePage && (
          <button
            type="button"
            onClick={() => {
              console.log("BUTTON CLICKED");
              navigate("/add-job?step=1");
            }}
            id="onboarding-add-btn"
            className="text-white bg-blue-400 py-[9px] px-3 sm:px-5 rounded-xl font-bold text-[15px] sm:text-[18px] transition duration-400 hover:scale-105 cursor-pointer"
          >
            {t("header.add_application")}
          </button>
        )}

        <div id="onboarding-avatar">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="destructive" size="icon" className="rounded-full w-[42px] h-[42px]">
              <Avatar size="lg">
                {isGuest ? (
                  <AvatarFallback className="bg-white/10 text-white/50 text-lg">?</AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src={avatarUrl} alt="avatar" />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                      {user?.email?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => isGuest ? setShowDemoModal(true) : navigate("/profile")}>
                {t("header.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => isGuest ? setShowDemoModal(true) : handleOpenChat()}>
                AI Chat
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                {t("header.logout")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
      {/* Bottom sheet выбора языка на мобайле */}
      {showLangModal && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/60 sm:hidden"
          onClick={() => setShowLangModal(false)}
        >
          <div
            className="w-full bg-[var(--surface-color)] border-t border-[var(--border-color)] rounded-t-2xl p-5 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => { handleLanguageChange(code); setShowLangModal(false); }}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer text-start ${
                    i18n.language === code
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 w-[90%] max-w-sm flex flex-col gap-4 shadow-xl">
            <h2 className="text-xl font-bold">{t("header.demo_modal_title")}</h2>
            <p className="text-white/60 text-sm">
              {t("header.demo_modal_text")}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-white/70 hover:text-white transition cursor-pointer"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => { setShowDemoModal(false); navigate("/login"); }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition cursor-pointer"
              >
                {t("header.sign_up")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
