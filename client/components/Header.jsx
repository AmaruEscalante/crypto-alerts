import Image from "next/image";

const Header = (user) => {
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
          <h1 className="hidden font-logo text-yellow-300 text-xl ml-2 lg:inline-grid cursor-pointer">
            THE CRYPTO BAY
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
          {/* <div></div> */}
          {console.log("USER is", user)}
          {/* {console.log(user.user)} */}
          {user?.user?.name !== undefined ? (
            <div className="text-white text-xl">
              Welcome {user.user.given_name}!
              <a
                className="ml-5 bg-red-900 p-3 rounded-md hover:bg-red-500"
                href="/api/auth/logout"
              >
                Logout
              </a>
            </div>
          ) : (
            // Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
            // <h3 className="text-white text-xl"></h3>
            <a className="text-white text-xl" href="/api/auth/login">
              Login
            </a>
          )}
          {/* Notifications */}
        </div>
      </div>
    </div>
  );
};

export default Header;
