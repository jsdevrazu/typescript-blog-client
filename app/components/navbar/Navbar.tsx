import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../redux/auth/authSlice";
import { RootState } from "../../store/store";
import styles from "./style.module.css";


const Navbar = () => {
  const router = useRouter();
  const [showModel, setShowModel] = useState(false);
  const { token, user} = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navItem = [
    {
      id: 1,
      name: "Login",
      path: "/login",
      className: router.pathname == "/login" ? `${styles.navActive} ${styles.navLink}` : styles.navLink,
    },
    {
      id: 2,
      name: "Register",
      path: "/register",
      className: router.pathname == "/register" ? `${styles.navActive} ${styles.navLink}` : styles.navLink,
    },
  ];


  // When User try to logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PROXY_API}/auth/logout`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        })
      localStorage.clear();
      dispatch(setAuth(data));
      toast.success("Logout Successfully")
      setShowModel(!showModel)
      router.push('/login')
    } catch (error: any) {
      if(error.response?.data?.message) return toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.navbar}>
            <div className={styles.logo}>
              <Link href="/">Typescript Blog</Link>
            </div>
            <ul>
              {/* Menu Render */}
              {token ? (
                <>
                  {/* After Login Profile Item With DropDown */}
                  <div className={styles.profile}>
                    <img
                      src={user?.avatar}
                      alt={user?.fullname}
                      onClick={() => setShowModel(!showModel)}
                    />
                    {/* Profile Model */}
                    <div
                      className={
                        showModel
                          ? `${styles.model} ${styles.modelShow}`
                          : styles.model
                      }
                    >
                      <h4 onClick={() => router.push(`/profile/${user._id}`)}>Profile</h4>
                      <h4  onClick={() => router.push(`/create-blog`)}>Create Post</h4>
                      {user.role === 'admin' && <h4 onClick={() => router.push('/admin/category')}>Create Category</h4>}
                      <h4 onClick={handleLogout}>Logout</h4>
                    </div>
                  </div>
                  {/* Profile Overlay */}
                  <div
                    onClick={() => setShowModel(!showModel)}
                    className={
                      showModel
                        ? `${styles.overlay} ${styles.overlayActive}`
                        : styles.overlay
                    }
                  ></div>
                </>
              ) : (
                navItem.map((item) => (
                  <li key={item.id}>
                    <Link href={item.path}>
                      <a
                        className={item.className}
                      >
                        {item.name}
                      </a>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
