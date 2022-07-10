import React from "react";
import { Bars } from "react-loader-spinner";

const Loader = () => {
  return (
    <>
      <div
      style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        minHeight:"90vh"
      }}
      >
      <Bars width="50" color="#4682b4" />
      </div>
    </>
  );
};

export default Loader;
