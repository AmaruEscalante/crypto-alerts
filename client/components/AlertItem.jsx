import React from "react";

const AlertItem = ({
  alertInfo: { crypto, price, image, error, buyOrSell },
}) => {
  return (
    <div className="flex justify-between items-center bg-primary py-5 border-t border-secondary px-10 text-white text-xl">
      <div className="flex items-center">
        <img className="h-7 w-7" src={image} alt={crypto} />
        <h2 className="ml-5">{crypto}</h2>
      </div>
      <div className="text-[#F79825]">64 500</div>
      <div>60 000</div>
      <h3>+/- {error}%</h3>
      <div className={`bg-gray-500 w-20 py-1 rounded-md text-center`}>
        {buyOrSell.toUpperCase()}
      </div>
    </div>
  );
};

export default AlertItem;
