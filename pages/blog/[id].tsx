import axios from "axios";
import moment from "moment";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Comment from "../../app/components/comment/Comment";
import LiteQuill from "../../app/components/editor/LiteQuill";
import Loader from "../../app/components/loader/Loader";
import Meta from "../../app/components/meta/Meta";
import { setComment } from "../../app/redux/comment/commentSlice";
import { RootState } from "../../app/store/store";
import { IBlog, IComment, IUser } from "../../app/utils/typescript";
import NotFound from "../404";
import styles from "./style.module.css";

const BlogDetails:FC<any> = ({ blog }) => {
  const {
    query: { id },
  } = useRouter();
  const [loading, setLoading] = useState(false);
  const [blogDetails, setBlogDetails] = useState<IBlog>(blog);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [showComments, setShowComments] = useState<IComment[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const limit = 6;

 

  const handleComment = async (body: string) => {
    if (!token) return toast.error("Please login");
    const myCommentData: any = {
      content: body,
      user: user,
      blog_id: blogDetails?._id as string,
      blog_user_id: (blogDetails?.user as IUser)._id,
    };
    setLoading(true);
    setShowComments([myCommentData, ...showComments]);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PROXY_API}/comment/comment`,
        {
          content: body,
          user: user._id,
          blog_id: blogDetails?._id,
          blog_user_id: (blogDetails?.user as IUser)._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      const myData: any = { data: { ...data?.data, user: user } };
      dispatch(setComment(myData));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      const getComments = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_PROXY_API}/comment/comments/blog/${id}?page=${page}&limit=${limit}`
          );
          setLoading(false);
          setShowComments(data?.comments);
          setCount(data?.total);
        } catch (error: any) {
          setLoading(false);
          console.log(error);
        }
      };

      getComments();
    }
  }, [id, page, limit]);

  const newArr = [...Array(count)].map((_, i) => i + 1);

  const isActive = (index: number) => {
    if (index === page) return "page-active";
    return "";
  };

  const handlePagination = (num: number) => {
    setPage(num);
  };

  if (error) return <NotFound />;

  return (
    <>
      {blogDetails && (
        <Meta
          title={`Typescript Blog - ${blogDetails?.title}`}
          keyword="typescript blog"
          description="razu islam"
        />
      )}
      {loading ? (
        <Loader />
      ) : (
        <section className={styles.blogDetails}>
          <div className="container">
            {blogDetails && (
              <div className={styles.blogContent}>
                <div className={styles.blogImg}>
                  <img src={blogDetails.thumbnail} alt={blogDetails.title} />
                </div>

                <div className={styles.header}>
                  <h1 className={styles.title}>
                    Post Title: {blogDetails.title}
                  </h1>
                  <h3>
                    Post By:{" "}
                    {user?.role === "admin"
                      ? "Admin"
                      : blogDetails.user?.fullname}
                  </h3>
                </div>
                {/* Time Ago */}
                <p className={styles.timeAgo}>
                  Post Time:{" "}
                  {moment(blogDetails.createdAt).startOf("hour").fromNow()}
                </p>
                {/* Show Element */}
                <div className={styles.content}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blogDetails.content,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Comment Box */}
            <hr
              style={{
                marginTop: "1em",
              }}
            />
            <h1
              style={{
                textAlign: "center",
                marginTop: "0.5em",
                color: "crimson",
              }}
            >
              ⭐ Comment ⭐
            </h1>
            <hr
              style={{
                marginTop: "1em",
                marginBottom: "1em",
              }}
            />
            {/* Comment Area */}
            {token && token ? (
              <LiteQuill
                callback={handleComment}
                body={body}
                setBody={setBody}
              />
            ) : (
              <h2>
                Please <Link href="/login">login</Link> to comment
              </h2>
            )}
            {/* Show All Comment Here */}
            <div className={styles.commentArea}>
              {showComments?.length > 0 &&
                showComments?.map((comment, index) => (
                  <Comment key={index} comment={comment} />
                ))}
            </div>

            {/* Comment Pagination */}
            {count && count > 1 && (
              //  {/* Pagination */}
              <nav
                style={{
                  marginTop: "3em",
                }}
              >
                <ul className="pagination">
                  <>
                    {count && count && page > 1 && (
                      <li
                        className="page-item"
                        onClick={() => handlePagination(page - 1)}
                      >
                        <a className="page-link" href="#" aria-label="Next">
                          <span aria-hidden="true">&laquo;</span>
                        </a>
                      </li>
                    )}
                    {/* Prev */}
                    {newArr &&
                      newArr.map((num: any) => (
                        <li
                          key={num}
                          className="page-item"
                          onClick={() => handlePagination(num)}
                        >
                          <span className={`page-link ${isActive(num)}`}>
                            {num}
                          </span>
                        </li>
                      ))}
                    {/* Next */}
                    {count && page < count && (
                      <li
                        className="page-item"
                        onClick={() => handlePagination(page + 1)}
                      >
                        <a className="page-link" href="#" aria-label="Next">
                          <span aria-hidden="true">&raquo;</span>
                        </a>
                      </li>
                    )}
                  </>
                </ul>
              </nav>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_PROXY_API}/blog/blog/${id}`
  );

  return {
    props: {
      blog: data?.blog
    }, // will be passed to the page component as props
  }
}


export default BlogDetails;
