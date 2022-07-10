import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../app/components/card/Card";
import Loader from "../app/components/loader/Loader";
import Meta from "../app/components/meta/Meta";
import { setBlogs } from "../app/redux/blogs/blogSlice";
import { RootState } from "../app/store/store";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { blogs } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    const getHomeBlogs = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_PROXY_API}/blog/home/blogs`
        );
        dispatch(setBlogs(data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    getHomeBlogs();
  }, []);

  return (
    <>
    <Meta title="Typescript Blog - Home" keyword="typescript blog" description="razu islam" />
      {loading ? (
        <Loader />
      ) : (
        <section className={styles.homeBlog}>
          <div className="container">
            {blogs &&
              blogs?.map((homeBlog) => (
                <div className={styles.homeBlogCategory} key={homeBlog?._id}>
                  <Link href={`/blogs/${homeBlog.name.toLocaleLowerCase()}`}>
                    <h3 className={styles.categoryLink}>
                      {homeBlog.name} <small>({homeBlog.count})</small>
                    </h3>
                  </Link>
                  {/* Based In category Render */}
                  <div className={styles.homeBlogs}>
                    {homeBlog.blogs &&
                      homeBlog.blogs?.map((blog) => (
                        <Card key={blog._id} blog={blog} />
                      ))}
                  </div>
                  {/* Pagination */}
                  <div className={styles.pagination}>
                    {homeBlog.count > 3 && (
                      <Link href={`/blogs/${homeBlog.name}`}>
                        Read More &gt;
                      </Link>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
