import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/Sign-up";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useTheme } from "./providers/ThemeProvider";
import Discover from "./pages/Discover";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth, onlineUsers } = useAuthStore();
  const { theme, fontsLoaded } = useTheme();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <Loader className="animate-spin h-10 w-10 text-accent" />
        <span className="ml-2">Authenticating...</span>
      </div>
    );
  }

  //console.log("Online Users:", onlineUsers);

  return (
    <div
      className={`w-full min-h-screen bg-primary text-primary ${
        fontsLoaded ? "" : "font-sans"
      }`}
      data-theme={theme}
    >
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/discover"
          element={authUser ? <Discover /> : <Navigate to={"/login"} />}
        />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
