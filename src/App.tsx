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

      console.log("data from database", data);
      HandleCardDataArr(
        data.map((item) => ({
          ...item,
          id_time: new Date(item.id_time),
          card_id:(item.card_id),
        })) as CardValue[],
      );
      console.log(CardDataArr);
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

  // ===================================
  //Loging
  // ===================================
  useEffect(() => {
    CardDataArr.find((item) =>
      item.id_time === draggedCardTimeId ? console.log(item.status) : undefined,
    );

    console.log(`draggedCardTimeId :${draggedCardTimeId}`);
    console.log();
  }, [draggedCardTimeId]);

  useEffect(() => {
    console.log(CardDataArr);
  }, [CardDataArr]);
  // ===================================

  const AddNewJobCard = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setFormLoading(true);
      console.log("Submit works");

      const formData = new FormData(e.currentTarget);
      const formJSObject = Object.fromEntries(formData);
      const status: CardStatus = "applied"; //temporary default value
      const newCard = {
        id_time: new Date(),
        status: status,
        ...formJSObject,
      } as CardValue;

      const { error } = await supabaseClient
        .from("job-helper-cards-database")
        .insert({ ...newCard, user_id: user?.id });

      if (error) {
        toast(error.message);

        console.error({ error });
        return;
      }

      HandleCardDataArr((prev) => [...prev, newCard]);
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

  const DeleteJobCard = (idTimeToDelete: Date) => {
    HandleCardDataArr((prev) =>
      prev.filter((item) => item.id_time !== idTimeToDelete),
    );
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
