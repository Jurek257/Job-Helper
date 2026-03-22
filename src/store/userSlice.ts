import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";

interface UserState {
  user: User;
  resumeURL: string | null;
  isGuest: boolean;
}
const initialState: UserState = { user: {} as User, resumeURL: null, isGuest: false };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isGuest = false;
    },
    setResumeURL: (state, action) => {
      state.resumeURL = action.payload;
    },
    setIsGuest: (state, action: { payload: boolean }) => {
      state.isGuest = action.payload;
    },
  },
});

export const { setUser, setResumeURL, setIsGuest } = userSlice.actions;
export default userSlice.reducer;
