import React from "react";

const AlertItem = ({
  alertInfo: { cryptoId, priceThreshold, errorMargin },
}) => {
  return (
    <div className="flex justify-between items-center bg-primary py-5 border-t border-secondary px-10 text-white text-xl">
      <div className="flex items-center">
        <img
          className="h-7 w-7"
          src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579"
          alt={cryptoId}
        />
        <h2 className="ml-5 hidden md:inline-grid">{cryptoId}</h2>
      </div>
      <div className="text-[#F79825] hidden md:inline-grid">64 500</div>
      <div>{priceThreshold}</div>
      <h3>+/- {errorMargin}% ()</h3>
      <div className={`bg-gray-500 w-20 py-1 rounded-md text-center`}>
        {/* {buyOrSell.toUpperCase()} */}
        {"BUY"}
      </div>
    </div>
  );
};

export default AlertItem;
