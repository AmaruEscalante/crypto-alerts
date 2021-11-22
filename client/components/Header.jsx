import Image from "next/image";
import { useAuth0 } from "@auth0/auth0-react";
import NotificationIcon from "pixelarticons/svg/notification.svg";
import { useNotificationsStore } from "../modules/auth/useNotificationsStore";
import Link from "next/link";

const Header = () => {
  const { user, loginWithRedirect, logout } = useAuth0();
  const notifications = useNotificationsStore((st) => st.notifications);

  return (
    <div className="bg-[#131517] sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-5 xl:mx-auto">
        {/* Logo */}
        <div className="flex items-center m-3 cursor-pointer">
          <Link href="/">
            <Image
              quality="100"
              src="/logo4x.png"
              alt="logo"
              height="50"
              width="50"
            />
          </Link>
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
          {user?.name !== undefined ? (
            <div className="flex items-center">
              <div className="hidden text-white text-2xl lg:inline-grid">
                Welcome {user.given_name}!
              </div>
              <div className="relative">
                <NotificationIcon className="w-10 h-10 text-white ml-5 cursor-pointer" />
                <div
                  className="absolute -top-1 -right-2 text-xs w-5 h-5
            bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white text-lg"
                >
                  {notifications.length}
                </div>
              </div>
              <button
                className="hidden ml-5 text-white text-xl bg-red-900 p-3 rounded-md lg:inline-grid hover:bg-red-500"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            // Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
            // <h3 className="text-white text-xl"></h3>
            <button onClick={loginWithRedirect} className="text-white text-xl">
              Login
            </button>
          )}
          {/* Notifications */}
        </div>
      </div>
    </div>
  );
};

export default Header;
