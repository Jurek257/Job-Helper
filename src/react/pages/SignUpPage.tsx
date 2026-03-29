import { supabaseClient } from "../../supabase";
import IconLogo from "../../assets/puzzle-jigsaw-svgrepo-com.svg?react";
import Briefcase from "../../assets/briefcase-svgrepo-com.svg?react";
import GoogleIcon from "../../assets/google-icon-logo-svgrepo-com.svg?react";
import { useDispatch } from "react-redux";
import { setIsGuest } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handelGoogleSignIn = async () => {
    supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: "select_account" },
      },
    });
  };

  const handleContinueAsGuest = () => {
    dispatch(setIsGuest(true));
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 divide-x-3 divide-[var(--surface-color)]">
      <div className="flex flex-col gap-5 py-5 px-[5%] hidden sm:flex">
        <div className="flex items-center gap-4">
          <IconLogo></IconLogo>
          <h1 className="text-[28px] text-white font-bold">
            Job<span className="text-[#2563EB]">Helper</span>
          </h1>
        </div>

        <h2 className="text-[36px] text-white font-bold ">
          {t("signup.tagline")} <br />
          <span className="text-white/50">{t("signup.tagline2")}</span>
        </h2>

        <p className="text-white/50">{t("signup.description")}</p>

        <span className="font-bold self-center text-[28px]">{t("signup.example")}</span>

        <div className="grid grid-cols-3 gap-10 ">
          <div className="flex flex-col justify-center items-center bg-[#22222d] rounded-xl w-full h-20 border border-[var(--border-color)]">
            <span className="text-blue-500 font-bold text-[28px]">13</span>{" "}
            <p className="text-white/50">{t("status.applied")}</p>{" "}
          </div>
          <div className="flex flex-col justify-center items-center bg-[#22222d] rounded-xl w-full h-20 border border-[var(--border-color)]">
            <span className="text-red-500 font-bold text-[28px]">20</span>{" "}
            <p className="text-white/50">{t("status.rejected")}</p>{" "}
          </div>
          <div className="flex flex-col justify-center items-center bg-[#22222d] rounded-xl w-full h-20 border border-[var(--border-color)]">
            <span className="text-green-500 font-bold text-[28px]">2</span>{" "}
            <p className="text-white/50">{t("status.interview")}</p>{" "}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 grid-rows-3 ">
          <div className="flex bg-[var(--surface-color)] w-full h-20 rounded-lg border border-[var(--border-color)] border-l-3 border-l-blue-500 justify-between items-center">
            {" "}
            <div className="ml-7">
              <p className="font-bold">Siemens AG</p>{" "}
              <p className="text-white/50">Frontend Developer</p>{" "}
            </div>
            <div className="flex mr-7 rounded-xl px-4 py-1 bg-blue-500/30 text-blue-400 font-bold ">
              {t("status.applied")}
            </div>
          </div>

          <div className="flex bg-[var(--surface-color)] w-full h-20 rounded-lg border border-[var(--border-color)] border-l-3 border-l-red-500 justify-between items-center">
            {" "}
            <div className="ml-7">
              <p className="font-bold">Deutsche Telekom</p>{" "}
              <p className="text-white/50">Full Stack Developer</p>{" "}
            </div>
            <div className="flex mr-7 rounded-xl px-4 py-1 bg-red-500/30 text-red-400 font-bold ">
              {t("status.rejected")}
            </div>
          </div>

          <div className="flex bg-[var(--surface-color)] w-full h-20 rounded-lg border border-[var(--border-color)] border-l-3 border-l-green-500 justify-between items-center">
            {" "}
            <div className="ml-7">
              <p className="font-bold">Edeka</p>{" "}
              <p className="text-white/50">Team Leader : Consulting</p>{" "}
            </div>
            <div className="flex mr-7 rounded-xl px-4 py-1 bg-green-500/30 text-green-400 font-bold ">
              {t("status.interview")}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-6 pt-5 px-[5%]">
        {" "}
        <div className="flex items-center gap-4 sm:hidden">
          <IconLogo></IconLogo>
          <h1 className="text-[28px] text-white font-bold">
            Job<span className="text-[#2563EB]">Helper</span>
          </h1>
        </div>
        <div className="flex flex-col w-fit h-fit px-10 pt-5 pb-10 rounded-full aspect-square justify-center items-center bg-[#22222d] border border-[var(--border-color)]">
          <Briefcase className="w-35 h-35" />
        </div>{" "}
        <span className="font-bold self-center text-[28px]">{t("signup.welcome")}</span>
        <p className="text-white/50 text-center">
          {t("signup.sign_in_text")}
        </p>
        <button
          onClick={handelGoogleSignIn}
          className="flex py-2 px-15 bg-[var(--surface-color)] items-center outline-none font-bold border border-[var(--border-color)] rounded-md cursor-pointer transition duration-300 hover:scale-102"
        >
          <GoogleIcon width={32} height={32} className="pe-2" />
          {t("signup.continue_google")}
        </button>
        <p className="text-white/50 text-[14px]">
          {t("signup.terms")}
        </p>
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-[var(--border-color)]" />
          <span className="text-white/30 text-[13px]">{t("common.or")}</span>
          <div className="flex-1 h-px bg-[var(--border-color)]" />
        </div>
        <button
          onClick={handleContinueAsGuest}
          className="text-white/50 text-[14px] hover:text-white/80 transition duration-200 cursor-pointer underline underline-offset-2"
        >
          {t("signup.continue_guest")}
        </button>
      </div>
    </div>
  );
}
