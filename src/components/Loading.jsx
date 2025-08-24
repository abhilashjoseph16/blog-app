"use client";

import React from "react";
import "./Loading.scss";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="loading-card">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}
