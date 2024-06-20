import React, { useState, useEffect } from "react";

import "../styles/css/profile.css";
import { useDataHandlers, useErrorHandlers } from "./formUtils";

import updateDataIcon from "../images/update.png";
import exitIcon from "../images/exit.png";
import deleteIcon from "../images/delete.png";
import userIcon from "../images/user.svg";
import phoneIcon from "../images/phone.svg";
import mailIcon from "../images/mail.svg";
import lockIcon from "../images/lock.svg";
import rebootIcon from "../images/reboot.png";
import closeIcon from "../images/close.png";

function Profile({ userId, deleteToken, closeProfilePopup }) {
  const [isProfileMenuActive, setProfileMenuActive] = useState(false)

  const { isData, setData, handleInputChange, handleFileChange } = useDataHandlers({
    avatar: {
      file: null,
      url: "",
    },
    fullName: "",
    numberPhone: "",
    email: "",
    password: "",
  });
  const { isMajorError, isMinorError, triggerMajorError, triggerMinorError } = useErrorHandlers();

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      const response = await fetch(`/api/profile/getUserData/${userId}`);
      const data = await response.json();

      if (!response.ok) return console.log(data.message);

      setData({
        ...isData,
        avatar: {
          url: data.avatar,
        },
        fullName: data.fullName,
        numberPhone: data.numberPhone,
        email: data.email,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUser(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('avatar', isData.avatar.file);
    formData.append("fullName", isData.fullName);
    formData.append("numberPhone", isData.numberPhone);
    formData.append("email", isData.email);
    formData.append("password", isData.password);

    try {
      const response = await fetch(`/api/profile/updateUserData/${userId}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        triggerMajorError();
        return console.log(data.message);
      }

      console.log(data.message)
      getUser()
    } catch (error) {
      triggerMajorError();
      console.log(error);
    }
  }

  async function deleteAccount() {
    try {
      const response = await fetch(`/api/profile/deleteUserData/${userId}`, { method: 'DELETE' });
      const data = await response.json();

      if(!response.ok) {
        triggerMinorError();
        return console.log(data.message);
      }

      console.log(data.message);
      deleteToken();
    } catch (error) {
      triggerMinorError();
      console.log(error);
    }
  }

  const reloadUserInformation = () => getUser();
  const toggleProfilenMenu = () => setProfileMenuActive(!isProfileMenuActive);

  return (
    <div className="profile-container">
      <div className="profile-popup">
        <div className="profile-popup__header">
          <div className="profile-popup__functional-part">
            <div className="profile-popup__reboot" onClick={reloadUserInformation}>
              <img className="reboot-icon" src={rebootIcon} alt="reboot.png" />
            </div>
            <div className="profile-popup__menu profile-menu">
              <div className="profile-menu__activator" onClick={toggleProfilenMenu}>
                <div className="profile-menu__title">Profile</div>
                <div className={`profile-menu__arrow ${isProfileMenuActive ? "active" : "inactive"}`}></div>
              </div>
              <div className={`profile-menu__context ${isProfileMenuActive ? "active" : "inactive"}`}>
                <ul className="profile-menu__context-list">
                  <label for="update-btn" className={`profile-menu__context-item ${isMajorError ? "active" : "inactive"}`}>
                    <img className="item-icon" src={updateDataIcon} alt="update.png" />
                    <span className="item-name">Update</span>
                  </label>
                  <li className="profile-menu__context-item" onClick={deleteToken}>
                    <img className="item-icon" src={exitIcon} alt="exit.png" />
                    <span className="item-name">Exit</span>
                  </li>
                  <li className={`profile-menu__context-item ${isMinorError ? "active" : "inactive"}`} onClick={deleteAccount}>
                    <img className="item-icon" src={deleteIcon} alt="delete.png" />
                    <span className="item-name">Delete</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="profile-popup__close" onClick={closeProfilePopup}>
            <img className="close-icon" src={closeIcon} alt="close.png" />
          </div>
        </div>
        <form className="profile-popup__form" onSubmit={updateUser}>
          <div className="profile-popup__image-box">
            <input type="file" id="user-file" onChange={handleFileChange} />
            <label for="user-file">
              <img className="user-image" src={isData.avatar.url} alt="user-image.png" />
            </label>
          </div>
          <div className="profile-popup__input-box">
            <div className="profile-popup__full-name">
              <input type="text" name="fullName" placeholder="Full name" autocomplete="off" value={isData.fullName} onChange={handleInputChange} />
              <img className="input-icon" src={userIcon} alt="user.svg" />
            </div>
            <div className="profile-popup__number-phone">
              <input type="tel" name="numberPhone" placeholder="Number phone" autocomplete="off" value={isData.numberPhone} onChange={handleInputChange} />
              <img className="input-icon" src={phoneIcon} alt="phone.svg" />
            </div>
            <div className="profile-popup__email">
              <input type="email" name="email" placeholder="Email" autocomplete="off" value={isData.email} onChange={handleInputChange} />
              <img className="input-icon" src={mailIcon} alt="mail.svg" />
            </div>
            <div className="profile-popup__password">
              <input type="password" name="password" placeholder="New password" onChange={handleInputChange} />
              <img className="input-icon" src={lockIcon} alt="lock.svg" />
            </div>
          </div>
          <button type="submit" id="update-btn" className="profile-popup__submit-btn">Update</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
