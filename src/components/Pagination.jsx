"use client";

import React from "react";
import "./Pagination.scss";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination-container" aria-label="Pagination Navigation">
      <ul className="pagination-list">
        <li className="pagination-item">
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
        </li>

        {pages.map((page) => (
          <li key={page} className="pagination-item">
            <button
              type="button"
              onClick={() => onPageChange(page)}
              disabled={page === currentPage}
              className={`pagination-btn ${page === currentPage ? "active" : ""}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          </li>
        ))}

        <li className="pagination-item">
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
