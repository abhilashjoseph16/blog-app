"use client";

import "./ErrorPage.scss";

export default function ErrorPage({ message }) {
  return (
    <div className="error-page-main-container">
      <div className="error-page-card">
        <p className="error-message">{message}</p>
      </div>
    </div>
  );
}
