import React, { useState, useEffect } from "react";
import "./drawer.css";

const Drawer = ({ isOpen, setIsDrawerOpen, handleSignOut, profile }) => {
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);
  const [blocker, setBlocker] = useState(false);

  function handleCloseDrawer(e) {
    if (e.target.classList.contains("drawer__shadow")) {
      if (blocker) return;
      setIsDrawerOpen(false);
    }
  }

  function handleGoToBox() {
    window.open("https://saverd.app/recipe_box", "_blank");
  }

  useEffect(() => {
    if (isOpen) {
      setBlocker(true);
      setActive1(true);
      setTimeout(() => {
        setActive2(true);
        setBlocker(false);
      });
    } else {
      setBlocker(true);
      setActive2(false);
      setTimeout(() => {
        setActive1(false);
        setBlocker(false);
      }, 200);
    }
  }, [isOpen]);

  return (
    <div className={`drawer ${active1 && "open"}`}>
      <div className="drawer__shadow" onClick={handleCloseDrawer}></div>
      <div className={`drawer__bar bar-drawer ${active2 && "open"}`}>
        <div className="bar-drawer__content">
          <div className="bar-drawer__title">SAVERD</div>
          <div className="bar-drawer__menu">
            {profile ? (
              <div className="bar-drawer__item" onClick={handleSignOut}>
                <svg className="bar-drawer__icon" viewBox="0 0 24 24">
                  <path d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z" />
                </svg>
                <span>Log out</span>
              </div>
            ) : null}
            <div className="bar-drawer__item" onClick={handleGoToBox}>
              <svg className="bar-drawer__icon" viewBox="0 0 24 24">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
              </svg>
              <span>Go to Recipe Box</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
