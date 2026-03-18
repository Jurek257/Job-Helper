import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { supabaseClient } from "../supabase";
import type { CardValue, CardStatus as CardStatus } from "../types/types";

import {
  updateJobStatus,
  deleteCard,
  addCard,
  setCards,
} from "../store/jobsCardArraySlice";
import { useState } from "react";

export function useCardActions() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.User.user);
  const [useError, setUseError] = useState<string | null>(null);

  const addNewJobCard = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      const formData = new FormData(e.currentTarget);
      const formJSObject = Object.fromEntries(formData);
      const status: CardStatus = "applied"; //temporary default value
      const newCard = {
        id_time: new Date().toISOString(),
        status: status,
        ...formJSObject,
      } as CardValue;

      const { data, error } = await supabaseClient
        .from("job-helper-cards-database")
        .insert({ ...newCard, user_id: user.id })
        .select()
        .single();

      if (error) {
        throw Error(error.message);
      }

      dispatch(addCard(data));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "addNewJobCard func error";
      setUseError(errorMessage);
      console.error(errorMessage);
    }
  };

  const deleteJobCard = async (card_id: string) => {
    try {
      const { error: backendError } = await supabaseClient
        .from("job-helper-cards-database")
        .delete()
        .eq("card_id", card_id);

      if (backendError) throw new Error(backendError.message);

      dispatch(deleteCard(card_id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "deleteJobCard func error";
      setUseError(errorMessage);
      console.error(errorMessage);
    }
  };

  const changeCardstatus = async (
    targetCardId: string,
    targetStatus: CardStatus,
  ) => {
    try {
      if (!targetCardId) {
        throw new Error("targer card id not defined");
      }

      const { error: backendError } = await supabaseClient
        .from("job-helper-cards-database")
        .update({ status: targetStatus })
        .eq("card_id", targetCardId);

      if (backendError) throw new Error(backendError.message);
      dispatch(
        updateJobStatus({ card_id: targetCardId, status: targetStatus }),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "changeCardstatus func error";
      setUseError(errorMessage);
      console.error(errorMessage);
    }
  };

  const fetchCards = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("job-helper-cards-database")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("no data from database");
      }
      dispatch(
        setCards(
          data.map((item) => ({
            ...item,
          })) as CardValue[],
        ),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "fetchCards func error";
      setUseError(errorMessage);
      console.error(errorMessage);
    }
  };

  return {
    addNewJobCard,
    deleteJobCard,
    changeCardstatus,
    fetchCards,
    useError,
  };
}
