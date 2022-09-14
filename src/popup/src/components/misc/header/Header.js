import React from "react";
import "./header.css";

export default ({ handleOpenDrawer }) => {
  function handleClose() {
    window.close();
  }
  return (
    <div id="header" className="header">
      <div className="icon menu" onClick={handleOpenDrawer}>
        <svg viewBox="0 0 24 24">
          <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
        </svg>
      </div>
      <div className="header__title">SAVERD</div>
      <div className="icon close" onClick={handleClose}>
        <svg viewBox="0 0 24 24">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </div>
      <div id="dropshadow"></div>
    </div>
  );
};
