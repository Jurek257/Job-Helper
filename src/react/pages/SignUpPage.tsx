import { supabaseClient } from "../../supabase";

export function SignUpPage() {
  const handelGoogleSignIn = async () => {
    supabaseClient.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div className="flex flex-col gap-5 m-auto mt-[10%] items-center w-1/3 py-5 px-3 bg-white rounded-lg shadow-lg">
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
    </div>
  );
}
