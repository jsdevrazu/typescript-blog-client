import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Button from "../button/Button";
import styles from "./style.module.css";
import { BsFillCameraFill } from "react-icons/bs";
import Input from "../input/Input";
import { FormSubmit, InputChange } from "../../utils/typescript";
import { storage } from '../../../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import { setAuth, setUserInfo } from "../../redux/auth/authSlice";

export interface Props {
  userInfo?: {
    avatar: string;
    createdAt: string;
    email: string;
    fullname: string;
    isActive: boolean;
    password: string;
    role: string;
    updatedAt: string;
    __v: number;
    _id: string;
  };
}


const MyProfile = ({ userInfo }: Props) => {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [showModel, setShowModel] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [progress,setProgress] = useState(0);
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    avatar: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e: InputChange) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFile = (e: InputChange) => {
    if(!e?.target.files) return;
    const storageRef = ref(storage, `profile_img/${e.target.files[0].name}`);
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
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  const handleProfileUpdate = async (e: FormSubmit) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_PROXY_API}/user/update/me`, formData,  {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      setFormData({...data?.user});
      dispatch(setUserInfo(data))
      localStorage.setItem("user", JSON.stringify({token, user:data?.user}))
      router.push("/")
    } catch (error: any) {
      console.log(error)
    }
  };

  const handlePasswordUpdate = async (e: FormSubmit) => {
    e.preventDefault();

    if(!oldPassword || oldPassword.length < 8 || oldPassword.length > 32) return toast.error("Password at least 8 charters or less then 32 charters")
    if(!newPassword || newPassword.length < 8 || newPassword.length > 32) return toast.error("Password at least 8 charters or less then 32 charters")

    try {
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_PROXY_API}/user/password`, {
        oldPassword,
        newPassword
      },  {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch(setAuth(data))
      localStorage.clear();
      toast.success("Password Update Successfully ")
      router.push("/login")
    } catch (error: any) {
      toast.error(error?.response?.data?.message)
    }
  };

  useEffect(() => {
    if (userInfo) {
      setFormData({ email:userInfo.email, avatar:userInfo.avatar, fullname:userInfo.fullname });
    }
  }, [userInfo]);

  return (
    <div className={styles.profile}>
      {/* Profile Img */}
      <div className={styles.userImg}>
        <img src={formData.avatar || user.avatar} alt={user.fullname} />
      </div>
      {/* User Info */}
      <div className={styles.userInfo}>
        <h3>{user.fullname}</h3>
        <p>{user.email}</p>
        <Button
          type="button"
          className="app_btn full"
          onClick={() => setShowModel(!showModel)}
        >
          Update Profile
        </Button>
        <br />
        <Button
          type="button"
          className="app_btn full"
          style={{
            marginTop: "1em",
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          Update Password
        </Button>
      </div>

      {/* UpDate profile Model */}
      <div
        className={
          showModel ? `${styles.model} ${styles.modelActive}` : styles.model
        }
      >
        <div className={styles.userImg}>
          <label htmlFor="profile">
            <BsFillCameraFill />
            <img src={formData.avatar || user.avatar} alt={user.fullname} />
          </label>
          <Input type="file" id="profile" style={{ display: "none" }} onChange={uploadFile} />
        </div>
        {/* Update User Profile */}
        <form className={styles.form} onSubmit={handleProfileUpdate}>
          {/* Form Control Element */}
          <div className={styles.formControl}>
            <label htmlFor="fullname">Full Name</label>
            <Input
              type="text"
              placeholder="Enter your email"
              value={formData.fullname}
              onChange={handleChange}
              id="fullname"
              name="fullname"
            />
          </div>
          {/* Form Control Element */}
          <div className={styles.formControl}>
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              id="email"
              name="email"
            />
          </div>
          <Button type="submit" className="app_btn full" disabled={!formData.avatar}>
            Update Now
          </Button>
        </form>
      </div>

      {/* Update Password Model */}
      <div
        className={
          showPassword ? `${styles.model} ${styles.modelActive}` : styles.model
        }
      >
        {/* Update User Profile */}
        <form className={styles.form} onSubmit={handlePasswordUpdate}>
          {/* Form Control Element */}
          <div className={styles.formControl}>
            <label htmlFor="oldPassword">Enter old password</label>
            <Input
              type="password"
              placeholder="Enter your oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              id="oldPassword"
              name="oldPassword"
            />
          </div>
          {/* Form Control Element */}
          <div className={styles.formControl}>
            <label htmlFor="newPassword">Enter your new password</label>
            <Input
              type="newPassword"
              placeholder="Enter your newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              id="newPassword"
              name="newPassword"
            />
          </div>
          <Button type="submit" className="app_btn full">
            Update Now
          </Button>
        </form>
      </div>

      {/* Overlay */}
      <div
        className={
          showModel
            ? `${styles.overlay} ${styles.overlayActive}`
            : styles.overlay
        }
        onClick={() => setShowModel(!showModel)}
      ></div>
      <div
        className={
          showPassword
            ? `${styles.overlay} ${styles.overlayActive}`
            : styles.overlay
        }
        onClick={() => setShowPassword(!showPassword)}
      ></div>
    </div>
  );
};

export default MyProfile;
