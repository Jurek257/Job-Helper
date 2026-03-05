import "./App.css";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { supabaseClient } from "./supabase";
import { Header } from "./react/sections/header";
import { Dashboard } from "./react/sections/dashboard";
import { AddAplicationPopup } from "./react/components/addAplicationPopup";
import { SignUpPage } from "./react/pages/SignUpPage";

import { setUser } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { useCardActions } from "./hooks/useCardActions";

function App() {
  const dispatch = useDispatch();
  const { fetchCards } = useCardActions();
  const CardArr = useSelector((state: RootState) => state.Cards.cardDataArr);
  const [isPopupShowed, setPopupShowed] = useState(false);
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
        //setUser(session.user);
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

  return user.id ? (
    <div className="">
      <Toaster />
      <Header setPopupShowed={setPopupShowed} />
      <Dashboard />
      <AddAplicationPopup
        isPopupShowed={isPopupShowed}
        setPopupShowed={setPopupShowed}
      />
    </div>
  ) : (
    <SignUpPage />
  );
}
export default App;
