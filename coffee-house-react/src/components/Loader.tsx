import React from "react";
import "../styles/components/_loader.scss";

const Loader = () => {
  return (
    <div className="loader-overlay" id="loader">
      <div className="loader" role="status" aria-label="Loading">
        <div className="loader__ring"></div>
        <div className="loader__core">
          <div className="loader__dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
