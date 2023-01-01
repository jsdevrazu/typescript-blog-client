import axios from "axios";
import Link from "next/link";
import React from "react";
import Card from "../app/components/card/Card";
import Meta from "../app/components/meta/Meta";
import styles from "../styles/Home.module.css";

const Home: React.FC<any> = ({ homeBlogs }) => {


  return (
    <>
      <Meta title="Typescript Blog - Home" keyword="typescript blog" description="razu islam" />
      <section className={styles.homeBlog}>
        <div className="container">
          {homeBlogs &&
            homeBlogs?.map((homeBlog: any) => (
              <div className={styles.homeBlogCategory} key={homeBlog?._id}>
                <Link href={`/blogs/${homeBlog.name.toLocaleLowerCase()}`}>
                  <h3 className={styles.categoryLink}>
                    {homeBlog.name} <small>({homeBlog.count})</small>
                  </h3>
                </Link>
                {/* Based In category Render */}
                <div className={styles.homeBlogs}>
                  {homeBlog.blogs &&
                    homeBlog.blogs?.map((blog: any) => (
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
    </>
  );
};

export const getServerSideProps = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_PROXY_API}/blog/home/blogs`
  );

  return {
    props: {
      homeBlogs: data?.blogs
    }
  }
}

export default Home;
