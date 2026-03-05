import { configureStore } from "@reduxjs/toolkit";
import draggedIdCardReducer from "./draggedCardIdSlice";
import CardsReducer from "./jobsCardArraySlice";
import UserReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    draggedIdCard: draggedIdCardReducer,
    Cards: CardsReducer,
    User: UserReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
