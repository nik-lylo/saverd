import React, { useState, useEffect } from "react";
import { apiUrl, callBackground } from "./../../helpers";
import "./save.css";

export default ({ loading, setLoading }) => {
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(undefined);
  const [activeUrl, setActiveUrl] = useState(null);
  const [recipe, setRecipe] = useState({});

  async function saveStart() {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const activeUrl = tabs[0].url;
    setActiveUrl(activeUrl);
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
      setLoading(false);

      if (res && res.message && res.message === "Success!") {
        setStatus(true);
        setRecipe(res.recipe);
      } else {
        setErrors([(res || {}).message || "Your recipe could not be saved."]);
        setStatus(false);
      }
    });
  };

  return (
    <div className="save">
      <div className="save__notification">
        <div>
          {/* *If we have got an errors */}
          {errors.length > 0 && (
            <div className="bg-red-lightest border-l-4 border-red-light mb-4 p-4 pt-3 text-sm pt-4 save__error">
              {errors.map((err, i) => (
                <p className="mt-1" key={i}>
                  {err}
                </p>
              ))}
            </div>
          )}

          {/*If we did not save our recipe  */}
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
                <p className="mt-1">
                  Recipe <b>{recipe.name}</b> was successfully saved!
                </p>
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
        </div>
      </div>
      {!Boolean(status) && (
        <div className="save__button">
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
