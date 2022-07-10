import { ChangeEvent, FormSubmit } from "react";

export type InputChange = ChangeEvent<HTMLInputElement>;
export type InputChangeAll = ChangeEvent<HTMLInputElement | HTMLTextAreaElement |HTMLSelectElement>;
export type FormSubmit = FormSubmit<HTMLFormElement>;

export interface LayoutProps {
  children: React.ReactNode;
}

export interface IPrams {
  id: string;
}

export interface ICategory {
  _id: string
  __v: number
  name: string
}

 export interface IUser {
  avatar: string
  createdAt: string
  fullname: string
  role: string
  isActive: string
  updatedAt: string
  _id: string
}

export interface IBlog {
  _id?: string
  user: string | any
  title: string
  content: string
  description: string
  thumbnail: string
  category: string | any
  createdAt: string
}

export interface IComment{
  _id?:string;
  user?: string | any;
  blog_id: string;
  blog_user_id: string;
  content: string;
  replyCM?: IComment[];
  reply_user?: string;
  createdAt:string
}