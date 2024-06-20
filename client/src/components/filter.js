import React, { useState } from "react";

import "../styles/css/filter.css";
import { useDataHandlers, useErrorHandlers } from "./formUtils";

import addressIcon from "../images/address.png";
import roomsIcon from "../images/rooms.png";
import priceIcon from "../images/price.png";
import closeIcon from "../images/close.png";

function Filter({ sendFilter, closeFilterPopup }) {
  const { isData, handleInputChange } = useDataHandlers({
    fullAddress: "",
    numberRooms: "",
    price: ""
  });
  const { isMajorError, triggerMajorError } = useErrorHandlers();

  function handleSubmit(event) {
    event.preventDefault();

    sendFilter(isData);
    closeFilterPopup();
  }

  return (
    <div className="filter-container">
      <div className="filter-popup">
        <div className="filter-popup__header">
          <div className="filter-popup__title">Filter</div>
          <div className="filter-popup__close" onClick={closeFilterPopup}>
            <img className="close-icon" src={closeIcon} alt="close.png" />
          </div>
        </div>
        <form className="filter-popup__form" onSubmit={handleSubmit}>
          <div className="filter-popup__input-box">
            <div className="filter-popup__full-address">
              <input type="text" name="fullAddress" placeholder="Full address" autocomplete="off" onChange={handleInputChange} />
              <img className="input-icon" src={addressIcon} alt="address.svg" />
            </div>
            <div className="filter-popup__number-rooms">
              <input type="text" name="numberRooms" placeholder="Number of rooms" autocomplete="off" onChange={handleInputChange} />
              <img className="input-icon" src={roomsIcon} alt="rooms.svg" />
            </div>
            <div className="filter-popup__price">
              <input type="text" name="price" placeholder="Price" autocomplete="off" onChange={handleInputChange} />
              <img className="input-icon" src={priceIcon} alt="price.svg" />
            </div>
          </div>
          <button type="submit" className={`filter-popup__submit-btn ${isMajorError ? "active" : "inactive"}`}>Filter</button>
        </form>
      </div>
    </div>
  );
}

export default Filter;
