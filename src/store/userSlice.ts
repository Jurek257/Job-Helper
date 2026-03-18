import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";

interface UserState {
  user: User;
  resumeURL: string | null;
}
const initialState: UserState = { user: {} as User, resumeURL: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setResumeURL: (state, action) => {
      state.resumeURL = action.payload;
    },
  },
});

export const { setUser, setResumeURL } = userSlice.actions;
export default userSlice.reducer;
