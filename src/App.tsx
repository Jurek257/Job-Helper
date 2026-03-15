import "./App.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { supabaseClient } from "./supabase";

import { setUser } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { useCardActions } from "./hooks/useCardActions";

import { Routes, Route, Navigate } from "react-router-dom";
import { Canban } from "./react/pages/Canban";
import { SignUpPage } from "./react/pages/SignUpPage";
import { Profile } from "./react/pages/Profile";

function App() {
  const dispatch = useDispatch();
  const { fetchCards } = useCardActions();
  const CardArr = useSelector((state: RootState) => state.Cards.cardDataArr);
  const user = useSelector((state: RootState) => state.User.user);

  // ===================================
  //  Loging
  // ===================================

  useEffect(() => {
    console.log("date array of cards in app :", CardArr);
  }, [CardArr]);
  // ===================================

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setUser(session.user));
        console.log(`user ${session.user.email} was logged in`);
      } else {
        console.error("user is not defined");
      }
    });
  }, []);

  useEffect(() => {
    if (user.id) {
      fetchCards();
    } else {
      console.error(" user id not defined");
    }
  }, [user]);

  return (
    <div className="">
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={user.id ? <Navigate to="/" /> : <SignUpPage />}
        />
        <Route
          path="/"
          element={user.id ? <Canban /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user.id ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}
export default App;
