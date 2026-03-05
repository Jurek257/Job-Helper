import { createSlice } from "@reduxjs/toolkit";

//  const [draggedCardId, setDraggedCardId] = useState<string>();

const draggedCardIdSlice = createSlice({
  name: "draggedCardId",
  initialState: { draggedCardId: null as string | null },
  reducers: {
    setDraggedCardId: (state, action) => {
      state.draggedCardId = action.payload;
    },
  },
});

export const { setDraggedCardId } = draggedCardIdSlice.actions;
export default draggedCardIdSlice.reducer;
