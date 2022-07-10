import React from "react";
import { Props } from "../my-profile/MyProfile";
import styles from "../my-profile/style.module.css";

const OtherUserProfile = ({ userInfo }: Props) => {
  return (
    <div>
      <div className={styles.profile}>
        {/* Profile Img */}
        <div className={styles.userImg}>
          <img src={userInfo?.avatar} alt={userInfo?.fullname} />
        </div>
        <div className={styles.userInfo}>
          <h3>{userInfo?.fullname}</h3>
          <p>{userInfo?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
