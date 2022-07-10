import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../../app/components/button/Button";
import Input from "../../app/components/input/Input";
import { RootState } from "../../app/store/store";
import NotFound from "../404";
import styles from "./category.module.css";
import { MdDeleteForever, MdEditNote } from "react-icons/md";
import axios from "axios";
import Loader from "../../app/components/loader/Loader";
import { FormSubmit, ICategory } from "../../app/utils/typescript";
import toast from "react-hot-toast";
import Meta from "../../app/components/meta/Meta";

const Category = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([{}]);
  const [edit, setEdit] = useState<ICategory | null>(null);

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();

    if (edit) {
      if (edit.name === category) return toast.error("Already Category Exits");
      setLoading(true);
      try {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_PROXY_API}/category/category/${edit._id}`,
          {
            name: category,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        setCategories((prev) => prev?.map((item : any) => item._id === edit._id ? {...item, name:data.category?.name} : item));
        toast.success(`Update Successfully`);
        setCategory("");
      } catch (error: any) {
        setLoading(false);
        toast.error(error?.response?.data?.message);
      }
    } else {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_PROXY_API}/category/category`,
          {
            name: category,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        setCategories([...categories, data.newCategory]);
        toast.success(`Category Added Successfully`);
        setCategory("");
      } catch (error: any) {
        setLoading(false);
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_PROXY_API}/category/category/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories((prev) =>
        prev.filter((category: any) => category?._id !== id)
      );
      setLoading(false);
      toast.success("Delete Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
   const getCategories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_PROXY_API}/category/categories`
        );
        setCategories(data?.categories);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (edit) setCategory(edit.name);
  }, [edit]);

  if (user?.role !== "admin") return <NotFound />;

  return (
    <>
    <Meta
        title={`Typescript Blog - Admin Dashboard`}
        keyword="typescript blog"
        description="razu islam"
      />
      {loading ? (
        <Loader />
      ) : (
        <section className={styles.category}>
          <div className="container">
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formControl}>
                <label htmlFor="category">Category</label>
                <Input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  id="category"
                />
                <Button className="app_btn" type="submit">
                  {edit ? "Update" : "Create"}
                </Button>
              </div>
            </form>
            {/* List Of Category */}
            {categories &&
              categories?.map((category: any, index: any) => (
                <div key={index} className={styles.listCategory}>
                  <h2>{category?.name}</h2>
                  <div className={styles.icon}>
                    <MdDeleteForever
                      onClick={() => handleDelete(category?._id)}
                      size={30}
                    />
                    <MdEditNote onClick={() => setEdit(category)} size={30} />
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Category;
