import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import QuillEditor from "../app/components/editor/ReactQuill";
import { RootState } from "../app/store/store";
import NotFound from "./404";
import styles from "../styles/blog.module.css";
import Input from "../app/components/input/Input";
import {
  FormSubmit,
  InputChange,
  InputChangeAll,
} from "../app/utils/typescript";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase";
import toast from "react-hot-toast";
import Button from "../app/components/button/Button";
import axios from "axios";
import Loader from "../app/components/loader/Loader";
import { BsTrash } from "react-icons/bs";
import { useRouter } from "next/router";
import Meta from "../app/components/meta/Meta";

const initialState = {
  user: "",
  title: "",
  content: "",
  description: "",
  thumbnail: "",
  category: "",
};

const CreateBlog = () => {
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.auth);
  const [body, setBody] = useState("");
  const [blog, setBlog] = useState(initialState);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([{}]);
  const divRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: InputChangeAll) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const uploadFile = (e: InputChange) => {
    if (!e?.target.files) return;
    const storageRef = ref(storage, `blog/${e.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        return toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setBlog({ ...blog, thumbnail: downloadUrl });
        });
      }
    );
  };

  // Delete Images
  const deleteImage = () => {
    if (window.confirm("Are you sure to delete this image?")) {
      const deleteRef = ref(storage, blog.thumbnail);
      deleteObject(deleteRef).then(() => {
        toast.success("Delete Successfully");
        setBlog({ ...blog, thumbnail: "" });
      });
    } else return toast.error(`You can't able to do that`);
  };

  const handlePost = async (e: FormSubmit) => {
    e.preventDefault();
    if (
      !blog.title ||
      blog.title?.trim()?.length < 10 ||
      blog.title?.trim()?.length > 50
    )
      return toast.error(
        "Title at least 10 character and less then 50 character"
      );
    if (!blog.content || blog.content?.trim()?.length < 2000)
      return toast.error("Content at least 2000 character");
    if (
      !blog.description ||
      blog.description?.trim()?.length < 50 ||
      blog.description?.trim()?.length > 200
    )
      return toast.error(
        "Description at least 50 character and less then 200 character"
      );
    if (!blog.thumbnail) return toast.error("Thumbnail Require");
    if (!blog.category) return toast.error("Category Require");
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_PROXY_API}/blog/create-blog`, blog, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      });
      setLoading(false)
      toast.success("Blog Create Successfully")
      router.push("/")
    } catch (error) {
      setLoading(false)
      console.log(error)
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
    if (body) {
      const content = divRef.current?.innerHTML as string;
      setBlog({ ...blog, content: content });
    }
  }, [body]);



  if (!token) return <NotFound />;

  return (
    <>
    <Meta
        title={`Typescript Blog - Create blog`}
        keyword="typescript blog"
        description="razu islam"
      />
      {loading ? (
        <Loader />
      ) : (
        <section className={styles.createBlog}>
          <div className="container">
            <h1>Post your blog</h1>
            <form className={styles.form} onSubmit={handlePost}>
              {/* Form Control Element */}
              <div className={styles.formControl}>
                <label htmlFor="title">Blog Title</label>
                <Input
                  placeholder="Blog title....."
                  name="title"
                  type="text"
                  value={blog.title}
                  onChange={handleChange}
                />
                <small>{blog.title?.length} / 50</small>
              </div>
              {/* Upload Thumbnail */}
              <div className={styles.formControl}>
                <label htmlFor="thumbnail">Upload Thumbnail</label>
                {blog.thumbnail ? (
                  <div className={styles.showDelete}>
                    <img src={blog.thumbnail} alt={blog.title} />
                    <BsTrash size={30} onClick={deleteImage} />
                  </div>
                ): <Input type="file" onChange={uploadFile} id="thumbnail" />}
                
              </div>
              {/* Blog Description */}
              <div className={styles.formControl}>
                <label htmlFor="description">Description</label>
                <textarea
                  placeholder="Blog description....."
                  name="description"
                  id="description"
                  cols={30}
                  rows={10}
                  onChange={handleChange}
                  value={blog.description}
                />
                <small>{blog.description?.length} / 200 </small>
              </div>
              {/* Select Category */}
              <div className={styles.formControl}>
                <label htmlFor="category">Choose Category</label>
                <select name="category" id="" onChange={handleChange}>
                  <option value="">Choose category</option>
                  {categories &&
                    categories.map((category: any, index: any) => (
                      <option key={index} value={category?._id}>
                        {category?.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.formControl}>
                <QuillEditor setBody={setBody} />
                <div
                  style={{
                    display: "none",
                  }}
                  ref={divRef}
                  dangerouslySetInnerHTML={{
                    __html: body,
                  }}
                />
                <small>{blog.content?.length} / 2000 </small>
              </div>
              <Button
                className="app_btn full"
                type="submit"
                style={{
                  marginTop: "2em",
                }}
                disabled={
                  progress < 100 ||
                  !blog.title ||
                  !blog.category ||
                  !blog.description ||
                  !blog.thumbnail
                }
              >
                Create Post
              </Button>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default CreateBlog;
