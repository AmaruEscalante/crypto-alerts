import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../../components/Header";
import EditAlertCard from "../../components/EditAlertCard";

const AlertItem = () => {
  const {
    query: { alertId, cryptoId, priceThreshold, errorMargin },
  } = useRouter();
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
      {/* /> */}
      {/* <h1>Alert Item: {alertId}</h1> */}
      <EditAlertCard
        alertInfo={{
          alertId,
          cryptoId,
          priceThreshold,
          errorMargin,
        }}
      />
    </div>
  );
};

export default AlertItem;
