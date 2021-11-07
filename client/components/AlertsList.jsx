import { useState, useEffect } from "react";
import AlertItem from "./AlertItem";
import { getAlerts } from "../pages/api/alerts-api";

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
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const response = await getAlerts("adasd");
      setAlerts(response);
      console.log(response);
    } catch (e) {
      console.log(`Fetching data failed with error ${e}`);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="bg-primary m-10 rounded-2xl px-0 pt-5">
      <div className="text-white text-3xl mb-5 px-10">Active Alerts</div>
      <div>
        {alerts.map((item) => (
          <AlertItem key={item.alertId} alertInfo={item} />
        ))}
      </div>
    </div>
  );
};

export default AlertsList;
