import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthStore } from "../modules/auth/useAuthStore";
import { useNotificationsStore } from "../modules/auth/useNotificationsStore";
import { wssEndpoint } from "./api/alerts-api";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Home() {
  const { isLoading, isAuthenticated, error, user, getIdTokenClaims } =
    useAuth0();
  const setUser = useAuthStore((st) => st.setUser);
  const setNotification = useNotificationsStore((st) => st.setNotification);
  const setTokenId = useAuthStore((st) => st.setTokenId);
  const [socketUrl, setSocketUrl] = useState(wssEndpoint);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setNotification(lastMessage);
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  useEffect(() => {
    if (isAuthenticated) {
      setUser(user);
      getIdTokenClaims().then((claims) => {
        setTokenId(claims.__raw);
      });
    }
  }, [user]);

  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

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
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
}
