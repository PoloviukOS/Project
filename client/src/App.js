import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import "./styles/css/App.css";
import "./styles/css/theme.css";

import HeaderApp from "./components/header";
import SignUp from "./components/signUp";
import SignIn from "./components/signIn";
import Profile from "./components/profile";
import RealEstate from "./components/realEstate";
import Favorites from "./components/favorites";
import Orders from "./components/orders";
import AdminConsole from "./components/adminConsole";
import Main from "./components/main";
import Filter from "./components/filter";
import Footer from "./components/footer";

function App() {
  const [isShowSignUpPopup, setShowSignUpPopup] = useState(false);
  const [isShowSignInPopup, setShowSignInPopup] = useState(false);
  const [isShowProfilePopup, setShowProfilePopup] = useState(false);
  const [isShowRealEstatePopup, setShowRealEstatePopup] = useState(false);
  const [isShowFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [isShowOrdersPopup, setShowOrdersPopup] = useState(false);
  const [isShowAdminConsolePopup, setShowAdminConsolePopup] = useState(false);
  const [isTheme, setTheme] = useState("dark");
  const [isShowFilterPopup, setShowFilterPopup] = useState(false);
  const [isFilterValues, setFilterValues] = useState({ fullAddress: "", numberRooms: "", price: "" });
  const [isTokenData, setTokenData] = useState({ userId: null, userRole: null });

  useEffect(() => {
    checkToken();
    checkTheme();
  }, []);

  function saveToken(token) {
    if (!token) return;

    localStorage.setItem("token", token);
    decodedToken(token);
  }
  function deleteToken() {
    localStorage.removeItem("token");
    checkToken();

    toggleProfilePopup();
  }
  function checkToken() {
    const token = localStorage.getItem("token");
    token ? decodedToken(token) : setTokenData({ userId: null, userRole: null });
  }
  function decodedToken(token) {
    const { userId, userRole } = jwtDecode(token);
    setTokenData({ userId, userRole });
  }

  function togglePopup(popupSetter, condition) {
    if (condition) popupSetter((prev) => !prev);
  }

  const toggleSignUpPopup = () => togglePopup(setShowSignUpPopup, !isTokenData.userId);
  const toggleSignInPopup = () => togglePopup(setShowSignInPopup, !isTokenData.userId);
  const toggleProfilePopup = () => togglePopup(setShowProfilePopup, isTokenData.userId);
  const toggleRealEstatePopup = () => togglePopup(setShowRealEstatePopup, isTokenData.userId);
  const toggleFavoritesPopup = () => togglePopup(setShowFavoritesPopup, isTokenData.userId);
  const toggleOrdersPopup = () => togglePopup(setShowOrdersPopup, isTokenData.userId);
  const toggleAdminConsolePopup = () => togglePopup(setShowAdminConsolePopup, isTokenData.userId && isTokenData.userRole === "admin");

  function toggleTheme() {
    const newTheme = isTheme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  }
  function checkTheme() {
    const savedTheme = localStorage.getItem("theme");
    if(savedTheme) setTheme(savedTheme)
  }

  const toggleFilterPopup = () => setShowFilterPopup(!isShowFilterPopup);
  const getFilter = (filterData) => setFilterValues(filterData);

  return (
    <div className={`containerApp ${isTheme}`}>
      <HeaderApp
        openSignUpPopup={toggleSignUpPopup}
        openSignInPopup={toggleSignInPopup}
        openProfilePopup={toggleProfilePopup}
        openRealEstatePopup={toggleRealEstatePopup}
        openFavoritesPopup={toggleFavoritesPopup}
        openOrdersPopup={toggleOrdersPopup}
        openAdminColsolePopup={toggleAdminConsolePopup}
        changeTheme={toggleTheme}
        openFilterPopup={toggleFilterPopup}
      />

      {isShowSignUpPopup && <SignUp saveToken={saveToken} closeSignUpPopup={toggleSignUpPopup} />}
      {isShowSignInPopup && <SignIn saveToken={saveToken} closeSignInPopup={toggleSignInPopup} />}
      {isShowProfilePopup && <Profile userId={isTokenData.userId} deleteToken={deleteToken} closeProfilePopup={toggleProfilePopup} />}
      {isShowRealEstatePopup && <RealEstate userId={isTokenData.userId} closeRealEstatePopup={toggleRealEstatePopup} />}
      {isShowFavoritesPopup && <Favorites userId={isTokenData.userId} closeFavoritesPopup={toggleFavoritesPopup} />}
      {isShowOrdersPopup && <Orders userId={isTokenData.userId} closeOrdersPopup={toggleOrdersPopup} />}
      {isShowAdminConsolePopup && <AdminConsole userId={isTokenData.userId} closeAdminConsolePopup={toggleAdminConsolePopup} />}
      {isShowFilterPopup && <Filter sendFilter={getFilter} closeFilterPopup={toggleFilterPopup} />}

      <Main userId={isTokenData.userId} filterValues={isFilterValues} />
      <Footer />
    </div>
  );
}

export default App;
