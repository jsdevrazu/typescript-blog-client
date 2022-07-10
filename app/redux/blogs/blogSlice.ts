import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBlog } from "../../utils/typescript";

export interface IHomeBlogs {
    _id: string;
    name: string;
    count: number;
    blogs: IBlog[];
}

export interface BlogState {
    blogs:IHomeBlogs[]
}

const initialState = {
    blogs: [] as IHomeBlogs[]
}

export const blogSlice = createSlice({
  name: "blog",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<BlogState>) => {
        return {...state, blogs:action.payload.blogs}
    }
  },
});

export const { setBlogs } = blogSlice.actions;
export default blogSlice.reducer;
