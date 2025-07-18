import { Link } from "react-router-dom";
import { LogOut, MessageCircleHeart, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useTheme } from "../providers/ThemeProvider"; // Add this

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { theme } = useTheme(); // Get current theme

  return (
    <header
      className="fixed top-0 z-40 w-full border-b backdrop-blur-lg"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <div className="container mx-auto h-16 px-4">
        <div className="flex h-full items-center justify-between">
          {/* Logo - unchanged */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-1 p-2 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg text-blue-800 flex items-center justify-center">
                <MessageCircleHeart className="w-10 h-10" />
              </div>
              <h1 className="text-xl font-bold uppercase bg-gradient-to-r from-blue-700 via-blue-400 to-purple-400 bg-clip-text text-transparent inline-block">
                Whispnet
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
              style={{
                backgroundColor: "var(--accent)",
                color: "white", // Always white text on accent
              }}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "white",
                  }}
                  title="Profile"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-red-600/20 text-primary border"
                  onClick={logout}
                  style={{
                    borderColor: "var(--danger)",
                  }}
                  title="Logout"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
