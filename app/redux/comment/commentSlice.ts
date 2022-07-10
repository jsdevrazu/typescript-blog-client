import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IComment } from "../../utils/typescript";

export interface ICommentState {
  data: any;
  total: number;
}

const initialState:ICommentState = {
  data: [],
  total: 1,
};

export const commentSlice = createSlice({
  name: "comment",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setComment: (state, action: PayloadAction<ICommentState>) => {
      return {...state,  data: [action.payload.data, ...state.data]}
    },
  },
});

export const { setComment } = commentSlice.actions;
export default commentSlice.reducer;
