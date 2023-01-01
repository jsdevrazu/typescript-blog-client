import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../app/components/loader/Loader";
import Meta from "../../app/components/meta/Meta";
import MyProfile from "../../app/components/my-profile/MyProfile";
import OtherUserProfile from "../../app/components/otherUser-profile/OtherUserProfile";
import UserBlog from "../../app/components/userBlog/UserBlog";
import { RootState } from "../../app/store/store";
import NotFound from "../404";
import styles from "./style.module.css";

const ProfileInfo = () => {
  const { query } = useRouter();
  const { id } = query;
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    avatar: "",
    createdAt: "",
    email: "",
    fullname: "",
    isActive: false,
    password: "",
    role: "",
    updatedAt: "",
    __v: 0,
    _id: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const getUserInfo = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_PROXY_API}/user/profile/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLoading(false);
          setUserInfo(data?.user);
        } catch (error: any) {
          setLoading(false);
          setError(error?.response?.data?.message);
        }
      };
      getUserInfo();
    }
  }, [id, token]);


  if(error) return <NotFound />

  return (
    <>
    <Meta title={`Typescript Blog - ${userInfo.fullname} Profile`} keyword="typescript blog" description="razu islam" />
      {loading ? (
        <Loader />
      ) : (
        <section className={styles.profileInfo}>
          <div className="container">
            <div className={styles.profileWrap}>
              {/* User Profile Info */}
              <div className={styles.profile}>
                {user?._id === id ? (
                  <MyProfile userInfo={userInfo} />
                ) : (
                  <OtherUserProfile userInfo={userInfo} />
                )}
              </div>
              {/* User Blog */}
              <div className={styles.userBlog}>
                <UserBlog />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProfileInfo;
