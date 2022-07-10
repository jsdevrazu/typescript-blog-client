import { configureStore, } from '@reduxjs/toolkit'
import auth from '../redux/auth/authSlice'
import blog from '../redux/blogs/blogSlice'
import comment from '../redux/comment/commentSlice'

export const store = configureStore({
  reducer: {
    auth,
    blog,
    comment
  },
  devTools: process.env.NODE_ENV !== 'production',
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

