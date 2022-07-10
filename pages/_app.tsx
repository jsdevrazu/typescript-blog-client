import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../app/store/store";
import Layout from "../app/components/layout/Layout";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import { setAuth } from "../app/redux/auth/authSlice";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();

  useEffect(() => {
    const myFunc = () => {
      const userData = localStorage.getItem("user");
      if (userData) store.dispatch(setAuth(JSON.parse(userData)));
    };
    myFunc();
    //when any error coming with axios it's showing to console to fix bug
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      function (error) {
        const res = error.response;
        //Checking token is expire or not if token expire return automatic logout and return login page
        if (res?.data?.message?.includes("invalid token")) {
          return new Promise((response, reject) => {
            axios
              .get(`${process.env.NEXT_PUBLIC_PROXY_API}/auth/logout`)
              .then(({ data }) => {
                store.dispatch(setAuth(data));
                localStorage.clear();
                router.push("/login");
              })
              .catch((err) => {
                console.log(err.response?.data?.message?.includes("authorization token"));
                if(err.response?.data?.message?.includes("authorization token")){
                  const data: any = {message: ""}
                  store.dispatch(setAuth(data));
                  localStorage.clear();
                  router.push("/login");
                }
                reject(error);
              });
          });
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <Provider store={store}>
      <Toaster />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
