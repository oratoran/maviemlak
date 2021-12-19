import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout title="Title" description="Description">
      Hello
    </Layout>
  );
};

export default Home;
