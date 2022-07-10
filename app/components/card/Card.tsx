import React from "react";
import { IBlog } from "../../utils/typescript";
import styles from "./style.module.css";
import moment from 'moment'
import { useRouter } from "next/router";

interface IProps {
  blog: IBlog
}

const Card: React.FC<IProps> = ({blog}) => {
  const router = useRouter();

  return (
    <>
      <div className={styles.card} onClick={() => router.push(`/blog/${blog._id}`)}>
        <div className={styles.card__header}>
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className={styles.card__image}
            width="100%"
            height="100%"
          />
        </div>
        <div className={styles.card__body}>
          <span className={`${styles.tag} ${styles.tag_blue}`}>Category: {blog.category?.name}</span>
          <h4>{blog.title}</h4>
          <p>
            {blog.description?.substring(0, 145)}...
          </p>
        </div>
        <div className={styles.card__footer}>
          <div className={styles.user}>
            <img
              src={blog.user?.avatar}
              alt="user__image"
              className={styles.user__image}
              width={50}
              height={50}
              onClick={() => router.push(`/profile/${blog.user._id}`)}
            />
            <div className={styles.user__info}>
              <h5>Post By: {blog?.user?.role === "admin" ? "Admin" : blog.user?.fullname}</h5>
              <small>{moment(blog.createdAt).endOf('hour').fromNow()}</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
