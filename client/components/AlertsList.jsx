import React from "react";
import AlertItem from "./AlertItem";

const activeAlerts = [
  {
    id: 1232,
    crypto: "bitcoin",
    image:
      "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
    price: "60000.56",
    error: "5",
    buyOrSell: "buy",
  },
  {
    id: 12323,
    crypto: "cardano",
    image:
      "https://assets.coingecko.com/coins/images/975/small/cardano.png?1547034860",
    price: "2.56",
    error: "2",
    buyOrSell: "sell",
  },
  {
    id: 1239423,
    crypto: "cardano",
    image:
      "https://assets.coingecko.com/coins/images/975/small/cardano.png?1547034860",
    price: "2.56",
    error: "2",
    buyOrSell: "sell",
  },
  {
    id: 1236769423,
    crypto: "cardano",
    image:
      "https://assets.coingecko.com/coins/images/975/small/cardano.png?1547034860",
    price: "2.56",
    error: "2",
    buyOrSell: "sell",
  },
];

const AlertsList = () => {
  return (
    <div className="bg-primary m-10 rounded-2xl px-0 pt-5">
      <div className="text-white text-3xl mb-5 px-10">Active Alerts</div>
      <div>
        {activeAlerts.map((alert) => (
          <AlertItem key={alert.id} alertInfo={alert} />
        ))}
      </div>
    </div>
  );
};

export default AlertsList;
