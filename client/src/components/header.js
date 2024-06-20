import React, { useState } from 'react'

import '../styles/css/header.css'

import aboutUsIcon from '../images/about-us.png'
import searchIcon from '../images/search.png'
import supportIcon from '../images/support.png'
import authenticationIcon from '../images/authentication.png'
import signUpIcon from '../images/sign-up.png'
import signInIcon from '../images/sign-in.png'
import accountIcon from '../images/account.png'
import profileIcon from '../images/profile.png'
import realEstateIcon from '../images/real-estate.png'
import favoritesIcon from '../images/favorites.png'
import ordersIcon from '../images/orders.png'
import consoleIcon from '../images/console.png'
import themesIcon from '../images/themes.png'
import filterIcon from '../images/filter.png'

function HeaderApp({ 
    openSignUpPopup,
    openSignInPopup,
    openProfilePopup,
    openRealEstatePopup,
    openFavoritesPopup,
    openOrdersPopup,
    openAdminColsolePopup,
    changeTheme,
    openFilterPopup
}) {
    const [isNavigationMenuActive, setNavigationMenuActive] = useState(false)
    const [isAuthenticationMenuActive, setAuthenticationMenuActive] = useState(false)
    const [isAccountMenuActive, setAccountMenuActive] = useState(false)

    const toggleNavigationMenu = () => setNavigationMenuActive(!isNavigationMenuActive)
    const toggleAuthenticationMenu = () => setAuthenticationMenuActive(!isAuthenticationMenuActive)
    const toggleAccountMenu = () => setAccountMenuActive(!isAccountMenuActive)
    
    return (
        <div className="header">
            <div className="navigation-menu">
                <div className="navigation-menu__logo-activator" onClick={toggleNavigationMenu}>
                    <div className="navigation-menu__logo-name">RealEstateNavigator</div>
                    <div className="navigation-menu__logo-bottom">
                        <div className="navigation-menu__logo-slogan">Landmark in the world of real estate</div>
                        <div className={`navigation-menu__activator-arrow ${isNavigationMenuActive ? 'active' : 'inactive'}`}></div>
                    </div>
                </div>
                <div className={`navigation-menu__context ${isNavigationMenuActive ? 'active' : 'inactive'}`}>
                    <ul className="navigation-menu__context-list">
                        <li className="navigation-menu__context-item about-us">
                            <img className="item-icon" src={aboutUsIcon} alt="about-us.png" />
                            <span className="item-name">About Us</span>
                        </li>
                        <li className="navigation-menu__context-item search">
                            <img className="item-icon" src={searchIcon} alt="search.png" />
                            <span className="item-name">Search</span>
                        </li>
                        <li className="navigation-menu__context-item support">
                            <img className="item-icon" src={supportIcon} alt="support.png" />
                            <span className="item-name">Support</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="custom-menu">
                <ul className="custom-menu__list">
                    <li className="custom-menu__item authentication-menu">
                        <div className="authentication-menu__activator" onClick={toggleAuthenticationMenu}>
                            <img className="item-icon" src={authenticationIcon} alt="authentication.png" />
                            <span className="item-name">Authentication</span>
                            <div className={`item-arrow ${isAuthenticationMenuActive ? 'active' : 'inactive'}`}></div>
                        </div>
                        <div className={`authentication-menu__context ${isAuthenticationMenuActive ? 'active' : 'inactive'}`}>
                            <ul className="authentication-menu__context-list">
                                <li className="authentication-menu__context-item sign-up" onClick={openSignUpPopup}>
                                    <img className="item-icon" src={signUpIcon} alt="sign-up.png" />
                                    <span className="item-name">Sign up</span>
                                </li>
                                <li className="authentication-menu__context-item sign-in" onClick={openSignInPopup}>
                                    <img className="item-icon" src={signInIcon} alt="sign-in.png" />
                                    <span className="item-name">Sign in</span>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="custom-menu__item account-menu">
                        <div className="account-menu__activator" onClick={toggleAccountMenu}>
                            <img className="item-icon" src={accountIcon} alt="account.png" />
                            <span className="item-name">Account</span>
                            <div className={`item-arrow ${isAccountMenuActive ? 'active' : 'inactive'}`}></div>
                        </div>
                        <div className={`account-menu__context ${isAccountMenuActive ? 'active' : 'inactive'}`}>
                            <ul className="account-menu__context-list">
                                <li className="account-menu__context-item profile" onClick={openProfilePopup}>
                                    <img className="item-icon" src={profileIcon} alt="profile.png" />
                                    <span className="item-name">Profile</span>
                                </li>
                                <li className="account-menu__context-item real-estate" onClick={openRealEstatePopup}>
                                    <img className="item-icon" src={realEstateIcon} alt="real-estate.png" />
                                    <span className="item-name">Real estate</span>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="custom-menu__item favorites" onClick={openFavoritesPopup}>
                        <img className="item-icon" src={favoritesIcon} alt="favorites.png" />
                        <span className="item-name">Favorites</span>
                    </li>
                    <li className="custom-menu__item orders" onClick={openOrdersPopup}>
                        <img className="item-icon" src={ordersIcon} alt="orders.png" />
                        <span className="item-name">Orders</span>
                    </li>
                    <li className="custom-menu__item console" onClick={openAdminColsolePopup}>
                        <img className="item-icon" src={consoleIcon} alt="console.png" />
                        <span className="item-name">Console</span>
                    </li>
                </ul>
            </div>
            <div className="control-menu">
                <ul className="control-menu__list">
                    <li className="control-menu__item themes" onClick={changeTheme}>
                        <img className="item-icon" src={themesIcon} alt="themes.png" />
                        <span className="item-name">Themes</span>
                    </li>
                    <li className="control-menu__item-line"></li>
                    <li className="control-menu__item filter" onClick={openFilterPopup}>
                        <img className="item-icon" src={filterIcon} alt="filter.png" />
                        <span className="item-name">Filter</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default HeaderApp