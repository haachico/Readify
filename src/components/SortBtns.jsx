import React from "react";

function SortBtns({ handleSort, pressedButton }) {
  return (
    <div className="sort--btns">
      <button
        onClick={() => handleSort("LATEST")}
        // className={pressedButton === "LATEST" ? "highlight" : ""}
        style={{
          backgroundColor: pressedButton === "LATEST" ? "#cbd5e1" : "",
          color: pressedButton === "LATEST" ? "black" : "",
        }}
      >
        Latest
      </button>
      <button
        onClick={() => handleSort("OLDEST")}
        // className={pressedButton === "LATEST" ? "highlight" : ""}
        style={{
          backgroundColor: pressedButton === "OLDEST" ? "#cbd5e1" : "",
          color: pressedButton === "OLDEST" ? "black" : "",
        }}
      >
        Oldest
      </button>
      <button
        onClick={() => handleSort("TRENDING")}
        // className={pressedButton === "TRENDING" ? "highlight" : ""}
        style={{
          backgroundColor: pressedButton === "TRENDING" ? "#cbd5e1" : "",
          color: pressedButton === "TRENDING" ? "black" : "",
        }}
      >
        Trending
      </button>
    </div>
  );
}

export default SortBtns;
