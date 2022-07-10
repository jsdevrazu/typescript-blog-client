import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Button from "../app/components/button/Button";
import Input from "../app/components/input/Input";
import Loader from "../app/components/loader/Loader";
import Meta from "../app/components/meta/Meta";
import { setAuth } from "../app/redux/auth/authSlice";
import { RootState } from "../app/store/store";
import { FormSubmit, InputChange } from "../app/utils/typescript";
import styles from "../styles/login.module.css";

const Register = () => {
  // All State variable
  const { token } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Handle Change Input Event
  const handleChange = (e: InputChange) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //When User try to login
  const handleLogin = async (e: FormSubmit) => {
    e.preventDefault();
    if (!formData.email) return toast.error("Email is require");
    if (
      !formData.fullname ||
      formData.fullname.length < 5 ||
      formData.fullname.length > 15
    )
      return toast.error(
        "Fullname must be at least 5 charters or less then 15 charters"
      );
    if (
      !formData.password ||
      formData.password.length < 8 ||
      formData.password.length > 32
    )
      return toast.error(
        "Password must be at least 8 charters or less then 32 charters"
      );
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PROXY_API}/auth/register`,
        formData
      );
      setLoading(false);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch(setAuth(data));
      toast.success("Register Successfully ! Please check your email and verify email")
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      if (error.response?.data?.message)
        return toast.error(error.response?.data?.message);
      else return toast.error("Invalid Email");
    }
  };

  // If User login but he try to going login then this time redirect user
  useEffect(() => {
    if (token) router.push("/");
  }, [token]);

  return (
    <>
    <Meta title="Typescript Blog - Register" keyword="typescript blog" description="razu islam" />
      {loading ? (
        <Loader />
      ) : (
        <section className={styles.login}>
          <div className={`${styles.container} container`}>
            <div className={styles.loginWrapper}>
              <h1>Create An Account</h1>
              <form className={styles.form} onSubmit={handleLogin}>
                {/* Form Control Element */}
                <div className={styles.formControl}>
                  <label htmlFor="fullname">Full Name</label>
                  <Input
                    type="fullname"
                    placeholder="Enter your email"
                    value={formData.fullname}
                    onChange={handleChange}
                    id="fullname"
                    name="fullname"
                     autoComplete="off"
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
                     autoComplete="off"
                  />
                </div>
                {/* Form Control Element */}
                {/* Form Control Element */}
                <div className={styles.formControl}>
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    id="password"
                    name="password"
                     autoComplete="off"
                  />
                </div>
                <Button disabled={!formData.email || !formData.password || !formData.fullname} className="app_btn full" type="submit">
                  Register
                </Button>
                {/* Footer Option */}
                <div className={styles.footer}>
                  <p>
                    if you already have an account? Please
                    <Link href="/login"> login now</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;
