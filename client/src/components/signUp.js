import React, { useState } from "react";

import "../styles/css/signUp.css";

import { useDataHandlers, useErrorHandlers } from "./formUtils";

import userIcon from "../images/user.svg";
import phoneIcon from "../images/phone.svg";
import mailIcon from "../images/mail.svg";
import lockIcon from "../images/lock.svg";
import closeIcon from "../images/close.png";
import userImage from "../images/default-user.png";

function SignUp({ saveToken, closeSignUpPopup }) {  
  const { isData, handleInputChange, handleFileChange } = useDataHandlers({
    avatar: {
      file: null,
      url: userImage
    },
    fullName: "",
    numberPhone: "",
    email: "",
    password: ""
  });
  const { isMajorError, triggerMajorError } = useErrorHandlers();

  async function userRegistration(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("avatar", isData.avatar.file);
    formData.append("fullName", isData.fullName);
    formData.append("numberPhone", isData.numberPhone);
    formData.append("email", isData.email);
    formData.append("password", isData.password);

    try {
      const response = await fetch("/api/authentication/registration", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        triggerMajorError();
        return console.log(data.message);
      }

      saveToken(data.token);
      closeSignUpPopup();
    } catch (error) {
      triggerMajorError();
      console.log(error);
    }
  }

  return (
    <div className="signUp-container">
      <div className="signUp-popup">
        <div className="signUp-popup__header">
          <div className="signUp-popup__title">Sign up</div>
          <div className="signUp-popup__close" onClick={closeSignUpPopup}>
            <img className="close-icon" src={closeIcon} alt="close.png" />
          </div>
        </div>
        <form className="signUp-popup__form" onSubmit={userRegistration}>
          <div className="signUp-popup__image-box">
            <input type="file" id="user-file" onChange={handleFileChange} />
            <label for="user-file">
              <img className="user-image" src={isData.avatar.url} alt="user-image.png" />
            </label>
          </div>
          <div className="signUp-popup__input-box">
            <div className="signUp-popup__full-name">
              <input type="text" name="fullName" placeholder="Full name" autocomplete="off" onChange={handleInputChange} />
              <img className="input-icon" src={userIcon} alt="user.svg" />
            </div>
            <div className="signUp-popup__number-phone">
              <input type="tel" name="numberPhone" placeholder="Number phone" autocomplete="off" onChange={handleInputChange} />
              <img className="input-icon" src={phoneIcon} alt="phone.svg" />
            </div>
            <div className="signUp-popup__email">
              <input type="email" name="email" placeholder="Email" autocomplete="off" onChange={handleInputChange} />
              <img className="input-icon" src={mailIcon} alt="mail.svg" />
            </div>
            <div className="signUp-popup__password">
              <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
              <img className="input-icon" src={lockIcon} alt="lock.svg" />
            </div>
          </div>
          <button type="submit" className={`signUp-popup__submit-btn ${ isMajorError ? "active" : "inactive" }`}>Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
