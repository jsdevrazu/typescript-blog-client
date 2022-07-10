import React, { ReactNode } from "react";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { LayoutProps } from '../../utils/typescript'

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
