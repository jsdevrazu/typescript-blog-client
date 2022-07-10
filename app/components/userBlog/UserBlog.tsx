import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Card from '../card/Card';
import Loader from '../loader/Loader';
import styles from './style.module.css';

interface IProps {
  user: any;
  blogs: any
}

const UserBlog = () => {

  const {
    query: { id },
  } = useRouter();
  const [blogs, setBlogs] = useState<IProps[]>();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 4;


  useEffect(() => {
    if (id) {
      const getCategoriesBlogs = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_PROXY_API}/blog/blogs/user/${id}?limit=${limit}&page=${page}`
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
  }, [id, page, limit]);

  const newArr = [...Array(count)].map((_, i) => i + 1);

  const isActive = (index: number) => {
    if (index === page) return "page-active";
    return "";
  };

  const handlePagination = (num: number) => {
    setPage(num);
  };


  return (
    <div>
      {loading ? <Loader /> : (
        <section className={styles.myBlog}>
          <h1>Posted By: {blogs && blogs[0]?.user?.fullname} all blog post</h1>
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
        </section>
      )}
    </div>
  )
}

export default UserBlog