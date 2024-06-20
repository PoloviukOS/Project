import React, { useState } from "react";

import "../styles/css/signIn.css";
import { useDataHandlers, useErrorHandlers } from "./formUtils";

import mailIcon from "../images/mail.svg";
import lockIcon from "../images/lock.svg";
import closeIcon from "../images/close.png";

function SignIn({ saveToken, closeSignInPopup }) {
  const { isData, handleInputChange } = useDataHandlers({ email: "", password: "" });
  const { isMajorError, triggerMajorError } = useErrorHandlers();

  async function userAuthorization(event) {
    event.preventDefault();
    
    try {
      const response = await fetch("/api/authentication/authorization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...isData }),
      });
      const data = await response.json();

      if (!response.ok) {
        triggerMajorError();
        return console.log(data.message);
      }

      saveToken(data.token);
      closeSignInPopup();
    } catch (error) {
      triggerMajorError();
      console.log(error);
    }
  }

  return (
    <div className="signIn-container">
      <div className="signIn-popup">
        <div className="signIn-popup__header">
          <div className="signIn-popup__title">Sign in</div>
          <div className="signIn-popup__close" onClick={closeSignInPopup}>
            <img className="close-icon" src={closeIcon} alt="close.png" />
          </div>
        </div>
        <form className="signIn-popup__form" onSubmit={userAuthorization}>
          <div className="signIn-popup__input-box">
            <div className="signIn-popup__email">
              <input type="email" name="email" placeholder="Email" autocomplete="off" onChange={handleInputChange} />
              <img className="input-icon" src={mailIcon} alt="mail.svg" />
            </div>
            <div className="signIn-popup__password">
              <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
              <img className="input-icon" src={lockIcon} alt="lock.svg" />
            </div>
          </div>
          <button type="submit" className={`signIn-popup__submit-btn ${ isMajorError ? "active" : "inactive" }`}>Sign in</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
