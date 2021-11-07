import { useState } from "react";
import SearchIcon from "pixelarticons/svg/search.svg";

const AlertCard = () => {
  const [buyOrSell, setBuyOrSell] = useState(0);
  const [crypto, setCrypto] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleBuyOrSell = (e) => {
    if (e.target.innerText === "Buy") {
      console.log("Buy selected");
      setBuyOrSell(1);
    } else if (e.target.innerText === "Sell") {
      console.log("Sell selected");
      setBuyOrSell(2);
    }
  };

  return (
    <div className="flex-1 bg-primary rounded-3xl m-10">
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
            <div className="absolute pl-3 inset-y-0 flex items-center">
              <SearchIcon className="w-5 h-5 text-gray-500" />
            </div>
            <input className="input" type="text" placeholder="Crypto" />
          </div>
          <div className="relative mt-2">
            <input
              className="input"
              type="text"
              placeholder="Price threshold"
            />
          </div>
          <div className="relative mt-2">
            <input className="input" type="text" placeholder="Error margin %" />
          </div>
        </div>
      </div>
      <div className="flex relative justify-center mt-5 h-10 text-black">
        <button className="bg-[#21C9B8] hover:text-white block w-full rounded-b-2xl  text-2xl">
          Create
        </button>
      </div>
    </div>
  );
};

export default AlertCard;
