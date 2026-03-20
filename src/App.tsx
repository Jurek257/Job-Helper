import "./App.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { supabaseClient } from "./supabase";

import { fetchResumeURLifExists } from "./services/userDataService";
import { setUser, setResumeURL } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { useCardActions } from "./hooks/useCardActions";

import { Routes, Route, Navigate } from "react-router-dom";
import { Canban } from "./react/pages/Canban";
import { SignUpPage } from "./react/pages/SignUpPage";
import { Profile } from "./react/pages/Profile";
import { ApplicateJobPage } from "./react/pages/ApplicateJob";

function App() {
  const dispatch = useDispatch();
  const { fetchCards } = useCardActions();
  //const CardArr = useSelector((state: RootState) => state.Cards.cardDataArr);
  const user = useSelector((state: RootState) => state.User.user);
  const resumeUrl = useSelector((state: RootState) => state.User.resumeURL);

  const loadResumeUrl = async () => {
    const url = await fetchResumeURLifExists(user.id);
    dispatch(setResumeURL(url));
    console.log("resume url redux", resumeUrl);
  };

useEffect([resumeUrl])

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
      loadResumeUrl();
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
        <Route
          path="/add-job"
          element={user.id ? <ApplicateJobPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}
export default App;
