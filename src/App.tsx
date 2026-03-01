import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { supabaseClient } from "./supabase";
import { Header } from "./react/sections/header";
import { Dashboard } from "./react/sections/dashboard";
import { AddAplicationPopup } from "./react/components/addAplicationPopup";
import { SignUpPage } from "./react/pages/SignUpPage";
import type { User } from "@supabase/supabase-js";
import type { CardValue, CardStatus as CardStatus } from "./types/types";

function App() {
  const [isPopupShowed, setPopupShowed] = useState(false);
  const [isFormLoading, setFormLoading] = useState<boolean>(false);
  const [CardDataArr, HandleCardDataArr] = useState<CardValue[]>([]);

  const [draggedCardTimeId, setDraggedCardTimeId] = useState<Date>();

  const [user, setUser] = useState<User>();

  // ===================================
  //Loging
  // ===================================
  useEffect(() => {
    CardDataArr.find((item) =>
      item.id_time === draggedCardTimeId ? console.log(item.status) : undefined,
    );

    console.log(`draggedCardTimeId :${draggedCardTimeId}`);
  }, [draggedCardTimeId]);

  useEffect(() => {
    console.log("date array of cards in app :", CardDataArr);
  }, [CardDataArr]);
  // ===================================

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        console.log(`user ${session.user.email} was logged in`);
      } else {
        setUser(undefined);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchCards();
  }, [user]);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("job-helper-cards-database")
        .select("*")
        .eq("user_id", user?.id);

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
  };

  const AddNewJobCard = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
  };

  const DeleteJobCard = async (card_id: string) => {
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

  const changeCardstatus = (
    targetIdTime: Date | undefined,
    targetStatus: CardStatus,
  ) => {
    console.log("changeCardstatus func working");
    if (!targetIdTime) {
      console.log("idDate of drag card undefined");
      return;
    }

    HandleCardDataArr((prev) =>
      prev.map((item) =>
        item.id_time === targetIdTime
          ? { ...item, status: targetStatus }
          : item,
      ),
    );
  };

  return user ? (
    <>
      <Toaster />
      <Header setPopupShowed={setPopupShowed} />
      <Dashboard
        jobJSdataArr={CardDataArr}
        DeleteCardFunc={DeleteJobCard}
        setDraggedCardTimeId={setDraggedCardTimeId}
        changeCardstatus={changeCardstatus}
        draggedCardTimeId={draggedCardTimeId}
      />
      <AddAplicationPopup
        isPopupShowed={isPopupShowed}
        setPopupShowed={setPopupShowed}
        handleForm={AddNewJobCard}
        isFormLoading={isFormLoading}
      />
    </>
  ) : (
    <SignUpPage />
  );
}
export default App;
