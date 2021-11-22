import { useState } from "react";
import SearchIcon from "pixelarticons/svg/search.svg";
import { createAlert } from "../pages/api/alerts-api";
import { useAuthStore } from "../modules/auth/useAuthStore";

const EditAlertCard = ({
  alertInfo: { cryptoId, priceThreshold, errorMargin, alertId },
}) => {
  const tokenId = useAuthStore((st) => st.tokenId);
  // Form data
  const [error, setError] = useState("");
  const [buyOrSell, setBuyOrSell] = useState(0);
  const [cryptoId, setCryptoId] = useState(cryptoId);
  const [priceThreshold, setPriceThreshold] = useState(priceThreshold);
  const [errorMargin, setErrorMargin] = useState(errorMargin);

  const handleBuyOrSell = (e) => {
    if (e.target.innerText === "Buy") {
      console.log("Buy selected");
      setBuyOrSell(1);
    } else if (e.target.innerText === "Sell") {
      console.log("Sell selected");
      setBuyOrSell(2);
    }
  };

  const handleSubmit = async () => {
    if (buyOrSell === 0) {
      setError("Please select a buy or sell option");
    } else if (cryptoId === "") {
      setError("Please enter a crypto currency");
    } else if (priceThreshold === "") {
      setError("Please enter a price");
    } else if (errorMargin === "") {
      setError("Please enter an error margin");
    } else {
      setError("");
      const newAlert = {
        // buyOrSell,
        cryptoId,
        priceThreshold: parseFloat(priceThreshold),
        errorMargin: parseFloat(errorMargin),
      };
      console.log(`New Alert ${JSON.stringify(newAlert)}`);
      try {
        const response = await createAlert(tokenId, newAlert);
        console.log(response);
      } catch (e) {
        console.log(`Error in alert creation ${e}`);
      } finally {
        console.log(`Finished createAlert call`);
      }
    }
  };

  return (
    <div className="flex-1 bg-primary rounded-3xl m-10 pb-5">
      <div className="flex items-center justify-center pt-3">
        <button
          onClick={handleBuyOrSell}
          className={`trade text-4xl hover:text-[#25F204]
          ${buyOrSell === 1 ? "text-[#25F204]" : ""}
          `}
        >
          Buy
        </button>
        <button
          onClick={handleBuyOrSell}
          className={`trade text-4xl hover:text-[#FF2828]
          ${buyOrSell === 2 ? "text-[#FF2828]" : ""}
          `}
        >
          Sell
        </button>
      </div>
      {/* <div className="flex"> */}
      <div className="flex items-center justify-center">
        <div className="flex-col">
          <div className="relative mt-2">
            <div className="input bg-gray-700 py-2">{cryptoId}</div>
          </div>
          <div className="relative mt-2">
            <input
              className="input"
              type="text"
              onChange={(e) => setPriceThreshold(e.target.value)}
              placeholder={priceThreshold}
            />
          </div>
          <div className="relative mt-2">
            <input
              onChange={(e) => setErrorMargin(e.target.value)}
              className="input"
              type="text"
              placeholder={errorMargin}
            />
          </div>
          <div className="relative mt-4">
            {error === "" ? (
              <></>
            ) : (
              <h3 className="absolute text-red-600 text-xl inset-y-[-10px]">
                {error}
              </h3>
            )}
          </div>
        </div>
      </div>
      <div className="flex relative justify-center mt-5 h-10 text-black">
        <button
          onClick={handleSubmit}
          className="bg-[#21C9B8] hover:text-white block rounded-2xl  text-2xl mx-5 px-5 "
        >
          Update
        </button>
        <button
          onClick={handleSubmit}
          className="hover:text-white block rounded-2xl  text-2xl bg-red-600 mx-5 px-5 "
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EditAlertCard;
