import Head from "next/head";
import React from "react";

interface IProps {
  title: string;
  keyword: string;
  description: string;
}

const Meta: React.FC<IProps> = ({ title, keyword, description }) => {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keyword} />
      <meta name="author" content="Razu Islam" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
    </Head>
  );
};

Meta.defaultProps = {
  title: "Demo Title",
  keyword: "Demo Keyword",
  description: "Demo Description",
};

export default Meta;
