import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";

import { useDataHandlers, useErrorHandlers } from "./formUtils";

import "swiper/css";
import "swiper/css/scrollbar";

import "../styles/css/favorites.css";

import searchIcon from "../images/search.svg";
import addressIcon from "../images/address.png";
import roomsIcon from "../images/rooms.png";
import priceIcon from "../images/price.png";
import linkIcon from "../images/link.png";
import deleteIcon from "../images/delete.png";
import closeIcon from "../images/close.png";
import rebootIcon from "../images/reboot.png";

function Favorites({ userId, closeFavoritesPopup }) {
  const [isRealEstate, setRealEstate] = useState([]);
  const [isFilterActive, setFilterActive] = useState(false);

  const { isData, handleInputChange } = useDataHandlers({ searchData: "" });
  const { isMajorError, triggerMajorError } = useErrorHandlers();

  useEffect(() => {
    getRealEstate();
  }, [isData.searchData]);

  async function getRealEstate() {
    try {
      const response = await fetch("/api/favorites/getRealEstate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchData: isData.searchData, userId }),
      })
      const data = await response.json();

      if (!response.ok) return console.log(data.message);

      setRealEstate(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteRealEstate(realEstateId) {
    try {
      const response = await fetch(`/api/favorites/deleteRealEstate/${userId}/${realEstateId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        triggerMajorError();
        return console.log(data.message);
      }

      getRealEstate();
      console.log(data.message);
    } catch (error) {
      triggerMajorError();
      console.log(error);
    }
  }

  const reloadRealEstateInformation = () => getRealEstate();
  const toggleFilter = () => setFilterActive(!isFilterActive);

  return (
    <div className="favorites-container">
      <div className="favorites-popup">
        <div className="favorites-popup__header">
          <div className="favorites-popup__functional-part">
            <div className="favorites-popup__reboot" onClick={reloadRealEstateInformation}>
              <img className="reboot-icon" src={rebootIcon} alt="reboot.png" />
            </div>
            <div className="favorites-popup__filter-activator" onClick={toggleFilter}>
              <div className="favorites-popup__title">Favorites</div>
              <div className={`favorites-popup__arrow ${isFilterActive ? 'active' : 'inactive'}`}></div>
            </div>
          </div>
          <div className={`favorites-popup__filter ${isFilterActive ? "active" : "inactive"}`}>
            <div className="favorites-popup__search">
              <input type="text" name="searchData" placeholder="Real estate data" autocomplete="off" onChange={handleInputChange}/>
              <img className="input-icon" src={searchIcon} alt="search.svg" />
            </div>
          </div>
          <div className="favorites-popup__close" onClick={closeFavoritesPopup}>
            <img className="close-icon" src={closeIcon} alt="close.png" />
          </div>
        </div>
        <div className="favorites-popup__information-cards">
          <Swiper
            modules={[Scrollbar]}
            spaceBetween={26}
            slidesPerView="auto"
            scrollbar={{ draggable: true }}
          >
            {isRealEstate.map((realEstate) => (
              <SwiperSlide key={realEstate._id}>
                <div className="favorites-popup__card">
                  <div className="favorites-popup__image-box">
                    <div className="favorites-popup__image-box">
                      <label className="favorites-popup__image-wrapper">
                        <img className="realEstate-image" src={realEstate.avatar} alt="realEstate-image.jpg" />
                        <img className="user-image" src={realEstate.owner.avatar} alt="user-image.jpg" />
                      </label>
                    </div>
                  </div>
                  <div className="favorites-popup__input-box">
                    <div className="favorites-popup__full-address">
                      <input type="text" value={realEstate.fullAddress} disabled />
                      <img className="input-icon" src={addressIcon} alt="address.svg" />
                    </div>
                    <div className="favorites-popup__number-rooms">
                      <input type="text" value={realEstate.numberRooms} disabled />
                      <img className="input-icon" src={roomsIcon} alt="rooms.svg" />
                    </div>
                    <div className="favorites-popup__price">
                      <input type="text" value={realEstate.price} disabled />
                      <img className="input-icon" src={priceIcon} alt="price.svg" />
                    </div>
                    <div className="favorites-popup__link">
                      <input type="text" value={realEstate.link} disabled />
                      <img className="input-icon" src={linkIcon} alt="link.svg" />
                    </div>
                    <div className="favorites-popup__description">
                      <textarea disabled>
                        {
                          realEstate.description + "\n\n" +
                          "Owner's full name: " + realEstate.owner.fullName + "\n" +
                          "Owner's phone number: " + realEstate.owner.numberPhone
                        }
                      </textarea>
                    </div>
                  </div>
                  <div className="favorites-popup__button-box">
                    <img className="delete-icon" src={deleteIcon} alt="delete.png" />
                    <button className={`favorites-popup__delete-btn ${isMajorError ? "active" : "inactive"}`}
                            onClick={() => deleteRealEstate(realEstate._id)}>Delete</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="favorites-popup__scrollbar-line">
              <div className="line"></div>
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default Favorites;