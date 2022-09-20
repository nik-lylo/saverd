import React, { useState, useEffect } from "react";
import Header from "../misc/header/Header";
import Loader from "../misc/loader/Loader";
import Login from "../login/Login";
import Save from "../recipes/Save";
import { apiUrl, callBackground } from "../../helpers";
import "./app.css";

const App = () => {
  const [loading, setLoading] = useState("init");
  const [profile, setProfile] = useState(undefined);

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
      <Header />
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
