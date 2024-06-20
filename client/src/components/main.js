import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";

import { useErrorHandlers } from "./formUtils";

import "swiper/css";
import "swiper/css/scrollbar";

import "../styles/css/main.css";

import addressIcon from "../images/address.png";
import roomsIcon from "../images/rooms.png";
import priceIcon from "../images/price.png";
import linkIcon from "../images/link.png";
import favoritesIcon from "../images/favorites.png";
import rebootIcon from "../images/reboot.png";

function Main({ userId, filterValues }) {
  const [isRealEstate, setRealEstate] = useState([]);
  const [isUserRealEstate, setUserRealEstate] = useState([]);

  const { isMajorError, triggerMajorError } = useErrorHandlers();

  useEffect(() => {
    getRealEstate();
    userId ? getUserRealEstate() : setUserRealEstate([]);
  }, [userId, filterValues])

  async function getRealEstate() {
    try {
      const response = await fetch("/api/main/getRealEstate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          fullAddress: filterValues.fullAddress,
          numberRooms: filterValues.numberRooms,
          price: filterValues.price
        }),
      })
      const data = await response.json();

      if(!response.ok) return console.log(data.message);

      setRealEstate(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserRealEstate() {
    try {
      const response = await fetch(`/api/main/getUserRealEstate/${userId}`);
      const data = await response.json();

      if(!response.ok) return console.log(data.message);
      
      setUserRealEstate(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function saveRealEstate(realEstateId) {
    if(!userId) return triggerMajorError();

    try {
      const response = await fetch(`/api/main/saveRealEstate/${userId}/${realEstateId}`);
      const { message } = await response.json();

      if(!response.ok) {
        triggerMajorError();
        return console.log(message);
      }

      getUserRealEstate();
      console.log(message);
    } catch (error) {
      triggerMajorError();
      console.log(error);
    }
  }

  async function deleteRealEstate(realEstateId) {
    try {
      const response = await fetch(`/api/main/deleteRealEstate/${userId}/${realEstateId}`, { method: 'DELETE' });
      const { message } = await response.json();

      if(!response.ok) {
        triggerMajorError();
        return console.log(message);
      }
      
      getUserRealEstate();
      console.log(message);
    } catch (error) {
      triggerMajorError();
      console.log(error);
    }
  }

  function reloadRealEstateInformation() {
    getRealEstate();
    if(userId) getUserRealEstate()
  }

  return (
    <div className="main-container">
      <div className="main__information-table main-swipper">
        <Swiper
          modules={[Scrollbar]}
          spaceBetween={26}
          slidesPerView="3"
          scrollbar={{ draggable: true }}
        >
          {isRealEstate.map((realEstate) => (
            <SwiperSlide key={realEstate._id}>
              <div className="main-swiper__card">
                <div className="main-swiper__image-box">
                  <div className="main-swiper__image-box">
                    <label className="main-swiper__image-wrapper">
                      <img className="realEstate-image" src={realEstate.avatar} alt="realEstate-image.jpg" />
                      <img className="user-image" src={realEstate.owner.avatar} alt="user-image.jpg" />
                    </label>
                  </div>
                </div>
                <div className="main-swiper__input-box">
                  <div className="main-swiper__full-address">
                    <input type="text" value={realEstate.fullAddress} disabled />
                    <img className="input-icon" src={addressIcon} alt="address.svg" />
                  </div>
                  <div className="main-swiper__number-rooms">
                    <input type="text" value={realEstate.numberRooms} disabled />
                    <img className="input-icon" src={roomsIcon} alt="rooms.svg" />
                  </div>
                  <div className="main-swiper__price">
                    <input type="text" value={realEstate.price} disabled />
                    <img className="input-icon" src={priceIcon} alt="price.svg" />
                  </div>
                  <div className="main-swiper__link">
                    <input type="text" value={realEstate.link} disabled />
                    <img className="input-icon" src={linkIcon} alt="link.svg" />
                  </div>
                  <div className="main-swiper__description">
                    <textarea disabled>
                      {
                        realEstate.description + "\n\n" +
                        "Owner's full name: " + realEstate.owner.fullName + "\n" +
                        "Owner's phone number: " + realEstate.owner.numberPhone
                      }
                    </textarea>
                  </div>
                </div>
                <div className="main-swiper__button-box">
                  <img className="favorites-icon" src={favoritesIcon} alt="favorites.png" />
                  {
                    isUserRealEstate.some(item => item._id === realEstate._id) ? 
                    <button className={`main-swiper__delete-btn ${isMajorError ? "active" : "inactive"}`} onClick={() => deleteRealEstate(realEstate._id)}>Delete</button> :
                    <button className={`main-swiper__save-btn ${isMajorError ? "active" : "inactive"}`} onClick={() => saveRealEstate(realEstate._id)}>Save</button>
                  } 
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="main-swipper__additional-elements">
            <div className="main-swiper__scrollbar-line">
              <div className="line"></div>
            </div>
            <div className="main-swipper__reboot" onClick={reloadRealEstateInformation}>
              <img className="reboot-icon" src={rebootIcon} alt="reboot.png" />
            </div>
          </div>
        </Swiper>
      </div>
    </div>
  );
}

export default Main;