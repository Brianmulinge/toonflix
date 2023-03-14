import { type NextPage } from "next";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Fullscreen from "../components/Fullsceen";
import requests from "./api/request";

console.log(requests.fetchTrending.length);
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Toonflix</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="relative">
          <Fullscreen />
        </div>
        <div className="absolute bottom-0">
          <Sidebar />
        </div>
      </main>
    </>
  );
};

export default Home;
