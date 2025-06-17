import React, { useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    setRecentPrompt,
  } = useContext(Context);

  const handleSend = () => {
    if (input.trim() !== "") {
      onSent();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const cardClick = (promptText) => {
    setRecentPrompt(promptText);
    onSent(promptText);
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.evil_icon} alt="User Icon" />
      </div>

      <div className="main-container">
        {showResult ? (
          <div className="result-display">
            <div className="result-title">
              <img src={assets.evil_icon} alt="User Icon" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="Gemini Icon" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="greet">
              <p>
                <span>Greetings, Mortal,</span>
              </p>
              <p>What lowly task requires my attention?</p>
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() =>
                  cardClick(
                    "Plot the most insidious routes to conquer strategic strongholds."
                  )
                }
              >
                <p>
                  Plot the most insidious routes to conquer strategic
                  strongholds.
                </p>
                <img src={assets.compass_icon} alt="Compass Icon" />
              </div>
              <div
                className="card"
                onClick={() =>
                  cardClick("Outline the most potent weaknesses of human will.")
                }
              >
                <p>Outline the most potent weaknesses of human will.</p>
                <img src={assets.bulb_icon} alt="Bulb Icon" />
              </div>
              <div
                className="card"
                onClick={() =>
                  cardClick("Devise a grand scheme to spread fear and despair.")
                }
              >
                <p>Devise a grand scheme to spread fear and despair.</p>
                <img src={assets.message_icon} alt="Message Icon" />
              </div>
              <div
                className="card"
                onClick={() =>
                  cardClick("Craft an arcane ritual to bolster my dark powers.")
                }
              >
                <p>Craft an arcane ritual to bolster my dark powers.</p>
                <img src={assets.code_icon} alt="Code Icon" />
              </div>
            </div>
          </>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <div>
              <img src={assets.gallery_icon} alt="Gallery Icon" />
              <img src={assets.mic_icon} alt="Mic Icon" />
              {!loading && input ? (
                <img
                  onClick={handleSend}
                  src={assets.send_icon}
                  alt="Send Icon"
                  className="send-icon"
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
