import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import NotFound from "../404";
import { ICategory } from "../../app/utils/typescript";
import Loader from "../../app/components/loader/Loader";
import Card from "../../app/components/card/Card";
import Meta from "../../app/components/meta/Meta";

const CategoryBlog = () => {
  const {
    query: { category },
  } = useRouter();
  const [categories, setCategories] = useState<ICategory>();
  const [blogs, setBlogs] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    const getCategories = async () => {
      if (category) {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_PROXY_API}/category/categories`
          );
          const newCategory = data?.categories?.find(
            (item: any) => item.name === category
          );
          setCategories(newCategory);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      }
    };

    getCategories();
  }, [category]);

  useEffect(() => {
    if (categories) {
      const getCategoriesBlogs = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_PROXY_API}/blog/home/blogs/${categories._id}?limit=${limit}&page=${page}`
          );
          setBlogs(data?.blogs);
          setCount(data?.total);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      };

      getCategoriesBlogs();
    }
  }, [category, categories, page, limit]);

  const newArr = [...Array(count)].map((_, i) => i + 1);

  const isActive = (index: number) => {
    if (index === page) return "page-active";
    return "";
  };

  const handlePagination = (num: number) => {
    setPage(num);
  };

  if (!categories) return <Loader />;

  return (
    <>
    <Meta title={`Typescript Blog - ${category}`} keyword="typescript blog" description="razu islam" />
      {loading ? (
        <Loader />
      ) : (
        <section className={styles.category}>
          <div className="container">
            {/* Based In category Render */}
            <h1
              style={{
                textTransform: "capitalize",
              }}
            >
              All {category} Blog
            </h1>
            <div className={styles.homeBlogs}>
              {blogs &&
                blogs?.map((blog: any, index: any) => (
                  <Card key={index} blog={blog} />
                ))}
            </div>
            {count && count > 1 && (
              //  {/* Pagination */}
              <nav className={styles.paginationMain}>
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

export default CategoryBlog;
