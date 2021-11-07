import Image from "next/image";

const Header = () => {
  return (
    <div className="bg-[#131517] sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-5 xl:mx-auto">
        {/* Logo */}
        <div className="flex items-center m-3 cursor-pointer">
          <Image
            quality="100"
            src="/logo4x.png"
            alt="logo"
            height="40"
            width="40"
          />
          <h1 className="flex hidden font-logo text-yellow-300 text-xl ml-2 lg:inline-grid cursor-pointer">
            THE CRYPTO WAY
          </h1>
        </div>
        {/* Search bar */}
        <div>
          <input
            className="input"
            type="text"
            placeholder="Search cryptos ..."
          />
        </div>
        <div className="flex ml-5">
          {/* User */}
          <div></div>
          <h3 className="text-white text-xl">Amaru Escalante</h3>
          {/* Notifications */}
        </div>
      </div>
    </div>
  );
};

export default Header;
