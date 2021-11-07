import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";

export default function Home() {
  return (
    <div className="bg-secondary" h-screen overflow-y-scroll>
      <Head>
        <title>The Crypto Way</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Iceberg&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      {/* Header */}
      <Header />
      <Feed />
    </div>
  );
}
