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

export function useCardActions() {
  const dispatch = useDispatch();
  //const CardsArr = useSelector((state: RootState) => state.Cards.cardDataArr);
  const user = useSelector((state: RootState) => state.User.user);

  const addNewJobCard = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      //e.preventDefault();
      //setFormLoading(true);

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
        //toast(error.message);

        console.error({ error });
        return;
      }
      console.log("data return", data);

      dispatch(addCard(data));
      // HandleCardDataArr((prev) => [...prev, data as CardValue]);
      /*       setFormLoading(false);
      setPopupShowed(false); */
    } catch (error) {
      /*  toast(
        error instanceof Error
          ? error.message
          : "Error during insert card to database : App.tsx AddNewJobCard()",
      ); */
      console.error(
        error instanceof Error
          ? error.message
          : "Error during insert card to database : App.tsx AddNewJobCard()",
      );
    }
  };

  const deleteJobCard = async (card_id: string) => {
    try {
      await supabaseClient
        .from("job-helper-cards-database")
        .delete()
        .eq("card_id", card_id);

      dispatch(deleteCard(card_id));

      /*  HandleCardDataArr((prev) =>
        prev.filter((item) => item.card_id !== card_id),
      ); */
    } catch (error) {
      /*  toast(
        error instanceof Error
          ? error.message
          : "Error during deleting card from database : App.tsx DeleteJobCard()",
      ); */
      console.error(
        error instanceof Error
          ? error.message
          : "Error during deleting card from database : App.tsx DeleteJobCard()",
      );
    }
  };

  const changeCardstatus = async (
    targetCardId: string,
    targetStatus: CardStatus,
  ) => {
    console.log("changeCardstatus func working");
    if (!targetCardId) {
      // console.log("idCard of drag card undefined");
      return { success: false, error: "idCard of drag card undefined" };
    }

    try {
      await supabaseClient
        .from("job-helper-cards-database")
        .update({ status: targetStatus })
        .eq("card_id", targetCardId);

      dispatch(
        updateJobStatus({ card_id: targetCardId, status: targetStatus }),
      );
      /*       HandleCardDataArr((prev) =>
        prev.map((item) =>
          item.card_id === targetCardId
            ? { ...item, status: targetStatus }
            : item,
        ),
      ); */
      return { success: true };
    } catch (error) {
      /*  toast(
        error instanceof Error
          ? error.message
          : "Error during card drop allign  : App.tsx changeCardstatus()",
      ); */
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error during card drop allign  : App.tsx changeCardstatus()",
      };
    }
  };

  const fetchCards = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("job-helper-cards-database")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        //toast(error.message);
        console.warn(error.message);
        return;
      }

      console.log("fetch data from database", data);
      if (!data) {
        return console.error("no data from database");
      }
      dispatch(
        setCards(
          data.map((item) => ({
            ...item,
            //id_time: item.id_time,
            //card_id: item.card_id,
          })) as CardValue[],
        ),
      );

      /*  HandleCardDataArr(
        data.map((item) => ({
          ...item,
          id_time: new Date(item.id_time),
          card_id: item.card_id,
        })) as CardValue[],
      ); */
    } catch (error) {
      /*       toast(
        error instanceof Error
          ? error.message
          : "Error during loading cards from database : App.tsx useEffect",
      ); */
      console.warn(
        error instanceof Error
          ? error.message
          : "Error during loading cards from database : App.tsx useEffect",
      );
    }
  };

  return { addNewJobCard, deleteJobCard, changeCardstatus, fetchCards };
}
