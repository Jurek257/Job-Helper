import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";

const userSlice = createSlice({
  name: "user",
  initialState: { user: {} as User },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
