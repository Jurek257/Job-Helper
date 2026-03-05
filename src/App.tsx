import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { supabaseClient } from "./supabase";
import { Header } from "./react/sections/header";
import { Dashboard } from "./react/sections/dashboard";
import { AddAplicationPopup } from "./react/components/addAplicationPopup";
import { SignUpPage } from "./react/pages/SignUpPage";
//import type { User } from "@supabase/supabase-js";
//import type { CardValue, CardStatus as CardStatus } from "./types/types";

import { setUser } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { useCardActions } from "./hooks/useCardActions";


function App() {
  const dispatch = useDispatch();
const { fetchCards } = useCardActions();
const CardArr = useSelector((state : RootState) => state.Cards.cardDataArr );

  const [isPopupShowed, setPopupShowed] = useState(false);
  const [isFormLoading, setFormLoading] = useState<boolean>(false);
//  const [CardArr, HandleCardDataArr] = useState<CardValue[]>([]);

  const user = useSelector((state: RootState) => state.User.user);

  //const [user, setUser] = useState<User>();

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

 /*  const fetchCards = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("job-helper-cards-database")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        toast(error.message);
        console.warn(error.message);
        return;
      }

      console.log("fetch data from database", data);

      HandleCardDataArr(
        data.map((item) => ({
          ...item,
          id_time: new Date(item.id_time),
          card_id: item.card_id,
        })) as CardValue[],
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Error during loading cards from database : App.tsx useEffect",
      );
      console.warn(
        error instanceof Error
          ? error.message
          : "Error during loading cards from database : App.tsx useEffect",
      );
    }
  }; */
  /* 
  const addNewJobCard = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setFormLoading(true);

      const formData = new FormData(e.currentTarget);
      const formJSObject = Object.fromEntries(formData);
      const status: CardStatus = "applied"; //temporary default value
      const newCard = {
        id_time: new Date(),
        status: status,
        ...formJSObject,
      } as CardValue;

      const { data, error } = await supabaseClient
        .from("job-helper-cards-database")
        .insert({ ...newCard, user_id: user?.id })
        .select()
        .single();

      if (error) {
        toast(error.message);

        console.error({ error });
        return;
      }
      console.log("data return", data);
      HandleCardDataArr((prev) => [...prev, data as CardValue]);
      setFormLoading(false);
      setPopupShowed(false);
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Error during insert card to database : App.tsx AddNewJobCard()",
      );
      console.error(
        error instanceof Error
          ? error.message
          : "Error during insert card to database : App.tsx AddNewJobCard()",
      );
    }
  }; */
  /* 
  const deleteJobCard = async (card_id: string) => {
    try {
      await supabaseClient
        .from("job-helper-cards-database")
        .delete()
        .eq("card_id", card_id);

      HandleCardDataArr((prev) =>
        prev.filter((item) => item.card_id !== card_id),
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Error during deleting card from database : App.tsx DeleteJobCard()",
      );
      console.error(
        error instanceof Error
          ? error.message
          : "Error during deleting card from database : App.tsx DeleteJobCard()",
      );
    }
  };
 */ /* 
  const changeCardstatus = async (
    targetCardId: string,
    targetStatus: CardStatus,
  ) => {
    console.log("changeCardstatus func working");
    if (!targetCardId) {
      console.log("idCard of drag card undefined");
      return;
    }

    try {
      await supabaseClient
        .from("job-helper-cards-database")
        .update({ status: targetStatus })
        .eq("card_id", targetCardId);
      HandleCardDataArr((prev) =>
        prev.map((item) =>
          item.card_id === targetCardId
            ? { ...item, status: targetStatus }
            : item,
        ),
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Error during card drop allign  : App.tsx changeCardstatus()",
      );
      console.error(
        error instanceof Error
          ? error.message
          : "Error during card drop allign  : App.tsx changeCardstatus()",
      );
    }
  };
 */
  return user.id ? (
    <div className="">
      <Toaster />
      <Header setPopupShowed={setPopupShowed} />
      <Dashboard
      //CardsArr={CardDataArr}
      // deleteJobCard={deleteJobCard}
      //changeCardstatus={changeCardstatus}
      />
      <AddAplicationPopup
        isPopupShowed={isPopupShowed}
        setPopupShowed={setPopupShowed}
        //handleForm={addNewJobCard}
        isFormLoading={isFormLoading}
      />
    </div>
  ) : (
    <SignUpPage />
  );
}
export default App;
