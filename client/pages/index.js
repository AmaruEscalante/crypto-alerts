import { useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthStore } from "../modules/auth/useAuthStore";

export default function Home() {
  const { isLoading, isAuthenticated, error, user, getIdTokenClaims } =
    useAuth0();
  const setUser = useAuthStore((st) => st.setUser);
  const setTokenId = useAuthStore((st) => st.setTokenId);

  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  useEffect(() => {
    if (isAuthenticated) {
      setUser(user);
      getIdTokenClaims().then((claims) => {
        setTokenId(claims.__raw);
      });
    }
  }, [user]);

  return (
    <div className="bg-secondary h-screen overflow-y-scroll">
      <Head>
        <title>The Crypto Bay - TCB</title>
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
