import { supabaseClient } from "../../supabase";
import IconLogo from "../../../public/puzzle-jigsaw-svgrepo-com.svg?react";
import Briefcase from "../../../public/briefcase-svgrepo-com.svg?react";
import GoogleIcon from "../../assets/google-icon-logo-svgrepo-com.svg?react";

export function SignUpPage() {
  const handelGoogleSignIn = async () => {
    supabaseClient.auth.signInWithOAuth({ provider: "google" });
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
          Track every application , <br />
          <span className="text-white/50">stay organised</span>
        </h2>

        <p className="text-white/50">
          Stop losing track of where you applied. JobHelper keeps all your
          applications in one place with a clear visual pipeline.
        </p>

        <span className="font-bold self-center text-[28px]">Example</span>

        <div className="grid grid-cols-3 gap-10 ">
          <div className="flex flex-col justify-center items-center bg-[#22222d] rounded-xl w-full h-20 border border-[var(--border-color)]">
            <span className="text-blue-500 font-bold text-[28px]">13</span>{" "}
            <p className="text-white/50">Applied</p>{" "}
          </div>
          <div className="flex flex-col justify-center items-center bg-[#22222d] rounded-xl w-full h-20 border border-[var(--border-color)]">
            <span className="text-red-500 font-bold text-[28px]">20</span>{" "}
            <p className="text-white/50">Rejected</p>{" "}
          </div>
          <div className="flex flex-col justify-center items-center bg-[#22222d] rounded-xl w-full h-20 border border-[var(--border-color)]">
            <span className="text-green-500 font-bold text-[28px]">2</span>{" "}
            <p className="text-white/50">Interview</p>{" "}
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
              Applied
            </div>
          </div>

          <div className="flex bg-[var(--surface-color)] w-full h-20 rounded-lg border border-[var(--border-color)] border-l-3 border-l-red-500 justify-between items-center">
            {" "}
            <div className="ml-7">
              <p className="font-bold">Deutsche Telekom</p>{" "}
              <p className="text-white/50">Full Stack Developer</p>{" "}
            </div>
            <div className="flex mr-7 rounded-xl px-4 py-1 bg-red-500/30 text-red-400 font-bold ">
              Rejected
            </div>
          </div>

          <div className="flex bg-[var(--surface-color)] w-full h-20 rounded-lg border border-[var(--border-color)] border-l-3 border-l-green-500 justify-between items-center">
            {" "}
            <div className="ml-7">
              <p className="font-bold">Edeka</p>{" "}
              <p className="text-white/50">Team Leader : Consulting</p>{" "}
            </div>
            <div className="flex mr-7 rounded-xl px-4 py-1 bg-green-500/30 text-green-400 font-bold ">
              Interview
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
        <span className="font-bold self-center text-[28px]">Welcome</span>
        <p className="text-white/50">
          Sign in to Continue tracking your Job applications
        </p>
        <button
          onClick={handelGoogleSignIn}
          className="flex py-2 px-15 bg-[var(--surface-color)] items-center outline-none font-bold border border-[var(--border-color)] rounded-md cursor-pointer transition duration-300 hover:scale-102"
        >
          <GoogleIcon width={32} height={32} className="pe-2" />
          Continue with Google
        </button>
        <p className="text-white/50 text-[14px]">
          By continue you agree our Terms and Privacy Policy
        </p>
      </div>

      {/*  <div className="flex flex-col gap-5 m-auto mt-[10%] items-center w-1/3 py-5 px-3 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl">Log in into your workspace</h2>

        <button
          onClick={handelGoogleSignIn}
          className="flex py-2 px-15 border border-gray-300 shadow-lg rounded-md cursor-pointer transition duration-300 hover:scale-105"
        >
          <img
            className="pe-2"
            width={32}
            height={32}
            src="src/assets/google-icon-logo-svgrepo-com.svg"
            alt="google img"
          />
          Log In with Google
        </button>
      </div> */}
    </div>
  );
}
