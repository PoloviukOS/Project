import React, { useState, useEffect } from "react";

import "../styles/css/orders.css";
import { useDataHandlers, useErrorHandlers } from "./formUtils";

import userIcon from "../images/user.svg";
import phoneIcon from "../images/phone.svg";
import mailIcon from "../images/mail.svg";
import closeIcon from "../images/close.png";
import rebootIcon from "../images/reboot.png";

function Orders({ userId, closeOrdersPopup }) {
  const { isData, setData, handleInputChange } = useDataHandlers({ fullName: "", numberPhone: "", email: "", order: "" });
  const { isMajorError, triggerMajorError } = useErrorHandlers();

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      const response = await fetch(`/api/orders/getDataUser/${userId}`);
      const data = await response.json();

      if (!response.ok) return console.log(data.message);

      setData({
        fullName: data.fullName,
        numberPhone: data.numberPhone,
        email: data.email
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function sendEmail(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/orders/placingAnOrder", {
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

      console.log(data.message);
      setData((previousData) => ({ ...previousData, order: "" }));
    } catch (error) {
      triggerMajorError();
      console.log(error);
    }
  }

  const reloadUserInformation = () => getUser();

  return (
    <div className="orders-container">
      <div className="orders-popup">
        <div className="orders-popup__header">
          <div className="orders-popup__functional-part">
            <div className="orders-popup__reboot" onClick={reloadUserInformation}>
              <img className="reboot-icon" src={rebootIcon} alt="reboot.png" />
            </div>
            <div className="orders-popup__title">Orders</div>
          </div>
          <div className="orders-popup__close" onClick={closeOrdersPopup}>
            <img className="close-icon" src={closeIcon} alt="close.png" />
          </div>
        </div>
        <form className="orders-popup__form" onSubmit={sendEmail}>
          <div className="orders-popup__input-box">
            <div className="orders-popup__full-name">
              <input type="text" value={isData.fullName} disabled />
              <img className="input-icon" src={userIcon} alt="user.svg" />
            </div>
            <div className="orders-popup__number-phone">
              <input type="tel" value={isData.numberPhone} disabled />
              <img className="input-icon" src={phoneIcon} alt="phone.svg" />
            </div>
            <div className="orders-popup__email">
              <input type="email" value={isData.email} disabled />
              <img className="input-icon" src={mailIcon} alt="mail.svg" />
            </div>
            <div className="orders-popup__order">
              <textarea value={isData.order} name="order" placeholder="Oreder text..." spellCheck="true" onChange={handleInputChange}></textarea>
            </div>
          </div>
          <button type="submit" className={`oredrs-popup__submit-btn ${isMajorError ? "active" : "inactive"}`}>Checkout</button>
        </form>
      </div>
    </div>
  );
}

export default Orders;
