import moment from "moment";
import Link from "next/link";
import React from "react";
import { IComment } from "../../utils/typescript";
import styles from "./style.module.css";

interface IProps {
  comment: IComment;
}

const Comment: React.FC<IProps> = ({ comment }) => {
  return (
    <div className={styles.comment}>
      {/* Avatar Comment  */}
      {comment.user && (
        <div className={styles.avatar}>
          <img src={comment.user?.avatar} alt={comment.user?.fullname} />
          <small>
            <Link href={`/profile/${comment.user?._id}`}>
              {comment.user?.fullname}
            </Link>
          </small>
        </div>
      )}
      {/* Comment List */}
      <div className={styles.commentList}>
        <div className={styles.commentBox}>
          <div
            dangerouslySetInnerHTML={{
              __html: comment.content,
            }}
          />
          {/* Reply User */}
          <div className={styles.replyUser}>
            <small style={{ cursor: "pointer" }}>- Reply -</small>

            <small>{moment(comment.createdAt).startOf("hour").fromNow()}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
