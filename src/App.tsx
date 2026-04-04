import "./App.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { supabaseClient } from "./supabase";

import { fetchResumeURLifExists } from "./services/userDataService";
import { setUser, setResumeURL, setIsGuest } from "./store/userSlice";
import { setCards } from "./store/jobsCardArraySlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { useCardActions } from "./hooks/useCardActions";

import { Routes, Route, Navigate } from "react-router-dom";
import { Canban } from "./react/pages/Canban";
import { SignUpPage } from "./react/pages/SignUpPage";
import { Profile } from "./react/pages/Profile";
import { ApplicateJobPage } from "./react/pages/ApplicateJob";

import { Analytics } from '@vercel/analytics/react';
const GUEST_CARDS_KEY = "jh_guest_cards";

function App() {
  const dispatch = useDispatch();
  const { fetchCards } = useCardActions();
  const user = useSelector((state: RootState) => state.User.user);
  const isGuest = useSelector((state: RootState) => state.User.isGuest);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Capture ONCE on first render — before React Router can strip the hash
  const isOAuthRedirect =
    window.location.hash.includes("access_token") ||
    window.location.search.includes("code=");

  const loadResumeUrl = useCallback(async () => {
    const url = await fetchResumeURLifExists(user.id);
    dispatch(setResumeURL(url));
  }, [user.id, dispatch]);

  // Migrate guest localStorage cards to Supabase after login
  const migrateGuestData = useCallback(async (userId: string) => {
    try {
      const raw = localStorage.getItem(GUEST_CARDS_KEY);
      if (!raw) return;

      // Remove immediately — prevents duplicate migration if called twice (StrictMode)
      localStorage.removeItem(GUEST_CARDS_KEY);

      const guestCards = JSON.parse(raw);
      if (!guestCards || guestCards.length === 0) return;

      const cardsToInsert = guestCards.map(
        ({ card_id: _id, ...rest }: { card_id: string;[key: string]: unknown }) => ({
          ...rest,
          user_id: userId,
        }),
      );

      const { error } = await supabaseClient
        .from("job-helper-cards-database")
        .insert(cardsToInsert);

      if (error) {
        console.error("Migration error:", error.message);
        return;
      }

      toast.success("Your demo data has been saved to your account!");
    } catch (err) {
      console.error("migrateGuestData error:", err);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("[AUTH] onAuthStateChange fired:", event, "session:", session?.user?.email ?? null);

      // If we're in an OAuth redirect and get INITIAL_SESSION null — wait for SIGNED_IN
      if (event === "INITIAL_SESSION" && !session && isOAuthRedirect) {
        console.log("[AUTH] Waiting for SIGNED_IN — OAuth redirect in progress");
        return;
      }
      setAuthInitialized(true);

      if (session) {
        const hasGuestCards = !!localStorage.getItem(GUEST_CARDS_KEY);
        console.log("[AUTH] hasGuestCards in localStorage:", hasGuestCards);

        dispatch(setUser(session.user));
        dispatch(setIsGuest(false));

        if (hasGuestCards) {
          await migrateGuestData(session.user.id);
        }
      } else {
        console.log("[AUTH] No session in onAuthStateChange");
        dispatch(setIsGuest(true));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, migrateGuestData]);

  useEffect(() => {
    console.log("[FETCH] user.id:", user.id, "| isGuest:", isGuest);
    if (user.id) {
      fetchCards();
      loadResumeUrl();
    } else if (isGuest) {
      fetchCards();
    }
  }, [user, isGuest, fetchCards, loadResumeUrl]);

  useEffect(() => {
    const hasGuestCards = localStorage.getItem(GUEST_CARDS_KEY);
    console.log("[RESTORE] localStorage guest cards exist:", !!hasGuestCards);

    if (!hasGuestCards) return;

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      console.log("[RESTORE] active session:", session?.user?.email ?? null);
      if (!session) {
        dispatch(setIsGuest(true));
        try {
          const cards = JSON.parse(hasGuestCards);
          dispatch(setCards(cards));
        } catch {
          // ignore
        }
      }
    });
  }, [dispatch]);

  if (!authInitialized) {
    return <div className="flex items-center justify-center h-screen text-white/50">Loading...</div>;
  }

  // Шаг 1: читаем параметр ?debug=true из URL
  const isDebugMode = new URLSearchParams(window.location.search).get("debug") === "true";
  // Шаг 2: проверяем, локальная ли среда
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  // Шаг 3: аналитика включена только если НЕ debug и НЕ localhost
  const analyticsEnabled = !isDebugMode && !isLocalhost;

  return (
    <div className="">
      {analyticsEnabled && <Analytics />}
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={user.id ? <Navigate to="/" /> : <SignUpPage />}
        />
        <Route path="/" element={<Canban />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-job" element={<ApplicateJobPage />} />
      </Routes>
    </div>
  );
}
export default App;
