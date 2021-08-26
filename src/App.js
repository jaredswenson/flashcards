import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

import "./App.css";
function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}

const FlashCard = ({ letter, numbers }) => {
  return (
    <div
      className="flashcard-wrapper"
      style={{
        backgroundImage: !numbers && `url(../images/${letter}.png)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <p className="App-link">
        {numbers ? letter : `${letter.toUpperCase()}${letter.toLowerCase()}`}
      </p>
    </div>
  );
};

function App() {
  let alphabet = "abcdefghijklmnopqrstuvwxyz";
  let numbers = "1234567890";
  const [doNumbers, setDoNumbers] = useState(false);
  const [index, setIndex] = useState(0);

  function abcHander({ key }) {
    if (key === alphabet[index]) {
      index < 25 ? setIndex(index + 1) : setIndex(0);
    }
  }

  function numHandler({ key }) {
    if (key === numbers[index]) {
      index < 9 ? setIndex(index + 1) : setIndex(0);
    }
  }

  useEventListener("keydown", doNumbers ? numHandler : abcHander);

  const toggleType = () => {
    setIndex(0);
    setDoNumbers(!doNumbers);
  };

  return (
    <div className="App">
      <header className="App-header">
        <FlashCard
          numbers={doNumbers}
          letter={doNumbers ? numbers[index] : alphabet[index]}
        />
        <FontAwesomeIcon
          icon={faSync}
          style={{ marginTop: 10 }}
          onClick={() => setIndex(0)}
        />
        <button onClick={() => toggleType()} className="toggle-button">
          {doNumbers ? "Letters" : "Numbers"}
        </button>
      </header>
    </div>
  );
}

export default App;
