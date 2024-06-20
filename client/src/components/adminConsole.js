import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Mousewheel } from 'swiper/modules';

import { useDataHandlers, useErrorHandlers } from "./formUtils";

import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/mousewheel';

import "../styles/css/adminConsole.css";

import searchIcon from "../images/search.svg"
import userIcon from "../images/user.svg";
import phoneIcon from "../images/phone.svg";
import mailIcon from "../images/mail.svg";
import rebootIcon from "../images/reboot.png";
import closeIcon from "../images/close.png";

function AdminConsole({ userId, closeAdminConsolePopup }) {
  const [isUsers, setUsers] = useState([]);
  const [isFilterActive, setFilterActive] = useState(false);

  const { isData, handleInputChange } = useDataHandlers({ searchData: "" });
  const { isMajorError, isMinorError, triggerMajorError, triggerMinorError } = useErrorHandlers();

  useEffect(() => {
    getUsers();
  }, [isData.searchData])

  async function getUsers() {
    try {
      const response = await fetch("/api/adminConsole/getDataUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchData: isData.searchData, userId }),
      })
      const data = await response.json();

      if(!response.ok) return console.log(data.message);

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }
  
  async function blockUser(id) {
    try {
      const response = await fetch(`/api/adminConsole/blockUser/${id}`, { method: 'PATCH', });
      const data = await response.json();

      if(!response.ok) {
        triggerMajorError();
        return console.log(data.message);
      }

      getUsers();
    } catch (error) {
      triggerMajorError();
      console.log(error);
    }
  }

  async function deleteUser(id) {
    try {
      const response = await fetch(`/api/adminConsole/deleteUser/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if(!response.ok) {
        triggerMinorError();
        return console.log(data.message);
      }

      getUsers();
      console.log(data.message);
    } catch (error) {
      triggerMinorError();
      console.log(error);
    }
  }

  const reloadUsersInformation = () => getUsers();
  const toggleFilter = () => setFilterActive(!isFilterActive);

  return (
    <div className="adminConsole-container">
      <div className="adminConsole-popup">
        <div className="adminConsole-popup__header">
          <div className="adminConsole-popup__functional-part">
            <div className="adminConsole-popup__reboot" onClick={reloadUsersInformation}>
              <img className="reboot-icon" src={rebootIcon} alt="reboot.png" />
            </div>
            <div className="adminConsole-popup__filter-activator" onClick={toggleFilter}>
              <div className="adminConsole-popup__title">Admin console</div>
              <div className={`adminConsole-popup__arrow ${isFilterActive ? 'active' : 'inactive'}`}></div>
            </div>
          </div>
          <div className={`adminConsole-popup__filter ${isFilterActive ? 'active' : 'inactive'}`}>
            <div className="adminConsole-popup__search">
              <input type="text" value={isData.searchData} name="searchData" placeholder="User data" autocomplete="off" onChange={handleInputChange} />
              <img className="input-icon" src={searchIcon} alt="search.svg" />
            </div>
          </div>
          <div className="adminConsole-popup__close" onClick={closeAdminConsolePopup} >
            <img className="close-icon" src={closeIcon} alt="close.png" />
          </div>
        </div>
        <div className="adminConsole-popup__user-information">
          <Swiper
            modules={[Scrollbar, Mousewheel]}
            spaceBetween={26}
            slidesPerView="auto"
            scrollbar={{ draggable: true }}
            mousewheel={{ invert: true }}
          >
            {isUsers.map(user => (
              <SwiperSlide className="adminConsole-popup__user-card" key={user._id}>
                <div className="adminConsole-popup__image-box">
                  <img className="user-image" src={user.avatar} />
                </div>
                <div className="adminConsole-popup__input-box">
                  <div className="adminConsole-popup__full-name">
                    <input type="text" value={user.fullName} disabled />
                    <img className="input-icon" src={userIcon} alt="user.svg" />
                  </div>
                  <div className="adminConsole-popup__number-phone">
                    <input type="tel" value={user.numberPhone} disabled />
                    <img className="input-icon" src={phoneIcon} alt="phone.svg" />
                  </div>
                  <div className="adminConsole-popup__email">
                    <input type="email" value={user.email} disabled />
                    <img className="input-icon" src={mailIcon} alt="mail.svg" />
                  </div>
                </div>
                <div className="adminConsole-popup__button-box">
                  <button className={`adminConsole-popup__blocked-btn ${ isMajorError ? "active" : "inactive" }`} onClick={() => blockUser(user._id)}>{user.blocked ? 'Unblock' : 'Block'}</button>
                  <button className={`adminConsole-popup__delete-btn ${ isMinorError ? "active" : "inactive" }`} onClick={() => deleteUser(user._id)}>Delete</button>
                </div>
              </SwiperSlide>
            ))}
            <div className="adminConsole-popup__scrollbar-line">
              <div className="line"></div>
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default AdminConsole;