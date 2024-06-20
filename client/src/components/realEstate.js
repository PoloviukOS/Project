import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from 'swiper/modules';

import { useDataHandlers, useErrorHandlers } from "./formUtils";

import 'swiper/css';
import 'swiper/css/scrollbar';

import "../styles/css/realEstate.css";

import searchIcon from "../images/search.svg"
import addressIcon from "../images/address.png";
import roomsIcon from "../images/rooms.png";
import priceIcon from "../images/price.png";
import linkIcon from "../images/link.png";
import deleteIcon from "../images/delete.png";
import closeIcon from "../images/close.png";
import rebootIcon from "../images/reboot.png";
import realEstateImage from "../images/default-realEstate.jpg";

function RealEstate({ userId, closeRealEstatePopup }) {
  const [isRealEstate, setRealEstate] = useState([]);
  const [isFilterActive, setFilterActive] = useState(false);

  const { isData, setData, handleInputChange, handleFileChange } = useDataHandlers({
    avatar: {
      file: null,
      url: realEstateImage
    },
    fullAddress: "",
    numberRooms: "",
    price: "",
    link: "",
    description: "",
    searchData: ""
  });
  const { isMajorError, isMinorError, triggerMajorError, triggerMinorError } = useErrorHandlers();

  useEffect(() => {
    getRealEstate();
  }, [isData.searchData])

  async function getRealEstate() {
    try {
      const response = await fetch("/api/realEstate/getRealEstate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchData: isData.searchData, userId }),
      })
      const data = await response.json();

      if(!response.ok) return console.log(data.message);

      setRealEstate(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addRealEstate(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("avatar", isData.avatar.file);
    formData.append("fullAddress", isData.fullAddress);
    formData.append("numberRooms", isData.numberRooms);
    formData.append("price", isData.price);
    formData.append("link", isData.link);
    formData.append("description", isData.description);

    try {
      const response = await fetch("/api/realEstate/addRealEstate", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        triggerMajorError();
        return console.log(data.message);
      }

      clearForm()
      getRealEstate()
    } catch (error) {
      triggerMajorError();
      console.log(error);
    }
  }

  async function deleteRealEstate(id) {
    try {
      const response = await fetch(`/api/realEstate/deleteRealEstate/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if(!response.ok) {
        triggerMinorError();
        return console.log(data.message);
      }

      getRealEstate()
      console.log(data.message);
    } catch (error) {
      triggerMinorError();
      console.log(error);
    }
  }

  function clearForm() {
    setData({
      ...isData,
      avatar: {
        file: null,
        url: realEstateImage
      },
      fullAddress: "",
      numberRooms: "",
      price: "",
      link: "",
      description: ""
    })
  }
  function resetFileInput(event) {
    event.target.value = null
  }

  const reloadRealEstateInformation = () => getRealEstate();
  const toggleFilter = () => setFilterActive(!isFilterActive);
  
  return (
    <div className="realEstate-container">
      <div className="realEstate-popup">
        <div className="realEstate-popup__header">
          <div className="realEstate-popup__functional-part">
            <div className="realEstate-popup__reboot" onClick={reloadRealEstateInformation}>
              <img className="reboot-icon" src={rebootIcon} alt="reboot.png" />
            </div>
            <div className="realEstate-popup__filter-activator" onClick={toggleFilter}>
              <div className="realEstate-popup__title">Real estate</div>
              <div className={`realEstate-popup__arrow ${isFilterActive ? 'active' : 'inactive'}`}></div>
            </div>
          </div>
          <div className={`realEstate-popup__filter ${isFilterActive ? 'active' : 'inactive'}`}>
            <div className="realEstate-popup__search">
              <input type="text" name="searchData" placeholder="Real estate data" autocomplete="off" onChange={handleInputChange} />
              <img className="input-icon" src={searchIcon} alt="search.svg" />
            </div>
          </div>
          <div className="realEstate-popup__close" onClick={closeRealEstatePopup}>
            <img className="close-icon" src={closeIcon} alt="close.png" />
          </div>
        </div>
        <div className="realEstate-popup__information-cards">
          <Swiper
              modules={[Scrollbar]}
              spaceBetween={26}
              slidesPerView="auto"
              scrollbar={{ draggable: true }}
          >
            <SwiperSlide>
              <form className="realEstate-popup__form" onSubmit={addRealEstate}>
                <div className="realEstate-popup__image-box">
                  <input type="file" id="realEstate-file" onClick={resetFileInput} onChange={handleFileChange} />
                  <label className="realEstate-popup__image-wrapper" for="realEstate-file">
                    <img className="realEstate-image" src={isData.avatar.url} alt="realEstate-image.jpg" />
                  </label>
                </div>
                <div className="realEstate-popup__input-box">
                  <div className="realEstate-popup__full-address">
                    <input type="text" value={isData.fullAddress} name="fullAddress" placeholder="Full address" autocomplete="off" onChange={handleInputChange} />
                    <img className="input-icon" src={addressIcon} alt="address.svg" />
                  </div>
                  <div className="realEstate-popup__number-rooms">
                    <input type="text" value={isData.numberRooms} name="numberRooms" placeholder="Number of rooms" autocomplete="off" onChange={handleInputChange} />
                    <img className="input-icon" src={roomsIcon} alt="rooms.svg" />
                  </div>
                  <div className="realEstate-popup__price">
                    <input type="text" value={isData.price} name="price" placeholder="Price" autocomplete="off" onChange={handleInputChange} />
                    <img className="input-icon" src={priceIcon} alt="price.svg" />
                  </div>
                  <div className="realEstate-popup__link">
                    <input type="text" value={isData.link} name="link" placeholder="Link to Google map" autocomplete="off" onChange={handleInputChange} />
                    <img className="input-icon" src={linkIcon} alt="link.svg" />
                  </div>
                  <div className="realEstate-popup__description">
                    <textarea value={isData.description} name="description" placeholder="Description..." spellCheck="true" onChange={handleInputChange}></textarea>
                  </div>
                </div>
                <div className="realEstate-popup__button-box">
                  <button type="submit" className={`realEstate-popup__submit-btn ${isMajorError ? "active" : "inactive"}`}>Add</button>
                  <button type="reset" className="realEstate-popup__reset-btn" onClick={clearForm}>Clear</button>
                </div>
              </form>
            </SwiperSlide>
              {isRealEstate.map(realEstate => (
                <SwiperSlide key={realEstate._id}>
                  <div className="realEstate-popup__card">
                    <div className="realEstate-popup__image-box">
                      <div className="realEstate-popup__image-box">
                        <label className="realEstate-popup__image-wrapper">
                          <img className="realEstate-image" src={realEstate.avatar} alt="realEstate-image.jpg" />
                          <img className="user-image" src={realEstate.owner.avatar} alt="user-image.jpg" />
                        </label>
                      </div>
                    </div>
                    <div className="realEstate-popup__input-box">
                      <div className="realEstate-popup__full-address">
                        <input type="text" value={realEstate.fullAddress} disabled />
                        <img className="input-icon" src={addressIcon} alt="address.svg" />
                      </div>
                      <div className="realEstate-popup__number-rooms">
                        <input type="text" value={realEstate.numberRooms} disabled />
                        <img className="input-icon" src={roomsIcon} alt="rooms.svg" />
                      </div>
                      <div className="realEstate-popup__price">
                        <input type="text" value={realEstate.price} disabled />
                        <img className="input-icon" src={priceIcon} alt="price.svg" />
                      </div>
                      <div className="realEstate-popup__link">
                        <input type="text" value={realEstate.link} disabled />
                        <img className="input-icon" src={linkIcon} alt="link.svg" />
                      </div>
                      <div className="realEstate-popup__description">
                        <textarea disabled>
                          {
                            realEstate.description + "\n\n" +
                            "Owner's full name: " + realEstate.owner.fullName + "\n" +
                            "Owner's phone number: " + realEstate.owner.numberPhone
                          }
                        </textarea>
                      </div>
                    </div>
                    <div className="realEstate-popup__button-box">
                      <img className="delete-icon" src={deleteIcon} alt="delete.png" />
                      <button
                        className={`realEstate-popup__delete-btn ${isMinorError ? "active" : "inactive"}`}
                        onClick={() => deleteRealEstate(realEstate._id)}>Delete</button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div className="realEstate-popup__scrollbar-line">
                <div className="line"></div>
              </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default RealEstate;