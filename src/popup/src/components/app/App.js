import React, { useState, useEffect } from "react";
import Header from "../misc/header/Header";
import Loader from "../misc/loader/Loader";
import Login from "../login/Login";
import Save from "../recipes/Save";
import { apiUrl, callBackground } from "../../helpers";
import "./app.css";
import Drawer from "../misc/drawer/Drawer";

const App = () => {
  const [loading, setLoading] = useState("init");
  const [profile, setProfile] = useState(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function handleCloseDrawer() {
    setIsDrawerOpen(false);
  }
  function handleOpenDrawer() {
    setIsDrawerOpen(true);
  }
  async function handleSignOut() {
    setLoading(true);
    setProfile(undefined);
    await chrome.storage.local.remove("token");
    setIsDrawerOpen(false);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }
  useEffect(() => {
    chrome.storage.local.get("token", ({ token }) => {
      const { access_token, expires_in, created_at } = token || {};
      if (access_token && created_at + expires_in > +new Date() / 1000) {
        // validate token
        callBackground({
          getRequestJson: [
            apiUrl("/api/v1/me"),
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${access_token}`,
              },
            },
          ],
        }).then((profile) => {
          if (profile && profile.id) {
            setProfile(profile);
          }
          // setTimeout(() => {
          //   setLoading(false);
          // }, 500);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="app">
      <Loader isOpen={loading} />
      <Header handleOpenDrawer={handleOpenDrawer} />
      <Drawer
        isOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        handleSignOut={handleSignOut}
        profile={profile}
      />
      <div className="app__page">
        {loading == "init" ? null : profile ? (
          <Save loading={loading} setLoading={setLoading} />
        ) : (
          <Login
            loading={loading}
            setLoading={setLoading}
            setProfile={setProfile}
          />
        )}
      </div>
    </div>
  );
};

export default App;
