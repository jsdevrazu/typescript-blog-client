import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string;
  user: {
    _id: string;
    fullname: string;
    email: string;
    role: string;
    avatar: string;
    isActive: boolean;
  };
}

const initialState: AuthState = {
  token: "",
  user: {
    _id: "",
    fullname: "",
    email: "",
    role: "",
    avatar: "",
    isActive: false,
  },
};

export const counterSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      return {
        ...state,
        token: action.payload?.token,
        user: action.payload?.user,
      };
    },
    setUserInfo: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload?.user
    },
  },
});

export const { setAuth, setUserInfo } = counterSlice.actions;
export default counterSlice.reducer;
