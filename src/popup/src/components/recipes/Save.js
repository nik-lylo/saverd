import React, { useState, useEffect } from "react";
import { apiUrl, callBackground } from "./../../helpers";
import "./save.css";

export default ({ loading, setLoading }) => {
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(undefined);
  const [activeUrl, setActiveUrl] = useState(null);
  const [infoImage, setInfoImage] = useState(null);
  const [infoDesc, setInfoDesc] = useState(null);
  const [infoTitle, setInfoTitle] = useState(null);
  const [infoState, setInfoState] = useState(false);

  function injectedFunc() {
    let image = null;
    let desc = null;
    let title = null;
    let state = true;
    const meta_image = document.querySelector('[property="og:image"]');
    const meta_desc = document.querySelector(`[property="og:description"]`);
    const meta_title = document.querySelector(`[property="og:title"]`);
    if (meta_image) {
      image = meta_image.content;
    }
    if (meta_desc) {
      desc = meta_desc.content;
    }
    if (meta_title) {
      title = meta_title.content;
    }
    if (!image && !title && !desc) {
      state = false;
    }
    return { image, desc, title, state };
  }
  console.log("did");
  console.log("anotherrrr");
  async function saveStart() {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const activeUrl = tabs[0].url;
    setActiveUrl(activeUrl);
    const pageResult = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: injectedFunc,
    });
    const pageData = pageResult[0].result;
    setInfoImage(pageData.image);
    setInfoDesc(pageData.desc);
    setInfoTitle(pageData.title);
    setInfoState(pageData.state);
  }

  useEffect(() => {
    saveStart();
  }, []);

  const saveRecipe = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrors([]);
    setStatus(undefined);
    setLoading(true);

    const { token } = await chrome.storage.local.get("token");
    console.log(token, "token");
    callBackground({
      getRequestJson: [
        apiUrl(`/api/v1/get_recipe?site=${encodeURIComponent(activeUrl)}`),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      ],
    }).then((res) => {
      console.log(res);
      setLoading(false);

      if (res && res.message && res.message === "Success!") {
        // @todo - may need improvement, I can't get your server to send an OK response
        setStatus(true);
      } else {
        setErrors([(res || {}).message || "Your recipe could not be saved."]);
        setStatus(false);
      }
    });
  };

  return (
    <div className="save">
      {infoState && (
        <div className="save__card card-save">
          <div className={`card-save__img ${!infoImage ? "big" : null}`}>
            <img
              src={
                infoImage
                  ? infoImage
                  : "https://www.pngitem.com/pimgs/m/521-5214308_fresh-vegetables-illustration-png-transparent-png.png"
              }
            />
          </div>
          {infoTitle && <div className="card-save__title">{infoTitle}</div>}
          {infoDesc && <div className="card-save__desc">{infoDesc}</div>}
        </div>
      )}
      <div className="save__notification">
        <div>
          {errors.length > 0 && (
            <div className="bg-red-lightest border-l-4 border-red-light mb-4 p-4 pt-3 text-sm pt-4">
              {errors.map((err, i) => (
                <p className="mt-1" key={i}>
                  {err}
                </p>
              ))}
            </div>
          )}

          {false === status && (
            <div className="text-sm text-center mb-4">
              <p className="mb-1">Please try again</p>
              <p className="mb-1">or</p>
              <p className="mb-1">
                <a href="https://saverd.app/contact" target="_blank">
                  Contact Support
                </a>
              </p>
            </div>
          )}

          {true === status && (
            <div className="text-sm text-left ">
              <div className="save__success bg-green-lightest border-l-4 border-green-light mb-4 p-4 pt-3 text-sm">
                <h3>Success!</h3>
                <p className="mt-1">Your recipe was successfully saved!</p>
                <p className="mt-1"> Check your recipe box to see it.</p>
              </div>
              <a
                className="save__goto bg-blue cursor-pointer focus:outline-none focus:shadow-outline hover:bg-blue-dark m-auto mt-6 mb-2 no-underline px-4 py-2 rounded table text-white"
                href="https://saverd.app/recipe_box"
                target="_blank"
              >
                Go to Recipe Box
              </a>
            </div>
          )}

          {status === undefined && !infoState && (
            <div className="text-sm text-left">
              <div className="save__info bg-gray-light border-l-4 border-gray-700 mb-4 p-4 pt-3 text-sm">
                <h3>Info!</h3>
                <p className="mt-1">No meta data was found!!!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {!Boolean(status) && (
        <div className={`save__button`}>
          <input
            type="button"
            className="text-sm cursor-pointer bg-blue focus:outline-none focus:shadow-outline hover:bg-blue-dark px-4 py-2 rounded text-white"
            value={false === status ? "Try Again" : "Save to Recipe Box"}
            onClick={saveRecipe}
          />
        </div>
      )}
    </div>
  );
};
