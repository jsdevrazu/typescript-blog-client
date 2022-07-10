import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Button from "../../app/components/button/Button";
import Meta from "../../app/components/meta/Meta";
import { setAuth } from "../../app/redux/auth/authSlice";
import { IPrams } from "../../app/utils/typescript";
import styles from "./style.module.css";

const ActiveAccount = () => {
  const { query }: any = useRouter();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id }: IPrams = query;
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      axios
        .post(`${process.env.NEXT_PUBLIC_PROXY_API}/auth/active-account`, {
          access_token: id,
        })
        .then((res) => {
          toast.success(`Email Verify Successfully`);
          setSuccess(`Email Verify Successfully`);
          dispatch(setAuth(res.data));
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setError(err?.response?.data?.message);
        })
        .finally(() => {
          setTimeout(() => {
            router.push("/");
          }, 2000);
        });
    }
  }, [id]);

  return (
    <>
      <Meta
        title={`Typescript Blog - Email Active`}
        keyword="typescript blog"
        description="razu islam"
      />
      {success && (
        <div className={styles.success}>
          {success}
          <Button
            type="button"
            className="app_btn"
            onClick={() => router.push("/")}
          >
            Back to home
          </Button>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
          <Button
            type="button"
            className="app_btn"
            onClick={() => router.push("/")}
          >
            Back to home
          </Button>
        </div>
      )}
    </>
  );
};

export default ActiveAccount;
