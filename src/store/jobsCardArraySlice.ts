import { createSlice } from "@reduxjs/toolkit";
import type { CardValue, CardStatus } from "../types/types";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: { cardDataArr: CardValue[] } = { cardDataArr: [] };

const jobCardsSLice = createSlice({
  name: "jobCardsSLice",
  initialState,
  reducers: {
    setCards: (state, action: PayloadAction<CardValue[]>) => {
      state.cardDataArr = action.payload;
    },
    addCard: (state, action: PayloadAction<CardValue>) => {
      state.cardDataArr.push(action.payload);
    },
    deleteCard: (state, action: PayloadAction<string>) => {
      state.cardDataArr = state.cardDataArr.filter(
        (item) => item.card_id !== action.payload,
      );
    },
    updateJobStatus: (
      state,
      action: PayloadAction<{ card_id: string; status: CardStatus }>,
    ) => {
      const chosedCard = state.cardDataArr.find(
        (item) => item.card_id === action.payload.card_id,
      );
      if (chosedCard) {
        chosedCard.status = action.payload.status;
      }
    },
  },
});

export const { setCards, addCard, deleteCard, updateJobStatus } =
  jobCardsSLice.actions;
export default jobCardsSLice.reducer;
