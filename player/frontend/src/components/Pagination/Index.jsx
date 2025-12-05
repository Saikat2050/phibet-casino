import React, { useState, useEffect } from "react";
import PrevArrow from "../../../public/assets/img/svg/PrevArrow";
import NextArrow from "../../../public/assets/img/svg/NextArrow";

const getPageNumbers = (totalPages, currentPage) => {
  const maxPages = 5;
  let pages = [];

  if (totalPages <= maxPages) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const left = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const right = Math.min(totalPages, currentPage + Math.floor(maxPages / 2));

    if (left > 2) {
      pages.push(1);
      if (left > 1) pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
};

const TablePagination = ({
  className = "",
  totalPages = 1,
  currentPage,
  onPageChange,
  showPagination,
}) => {
  // const [page, setPage] = useState(currentPage);

  // useEffect(() => {
  //   console.log("useEffectonPageChange", page);
  //   onPageChange(page); // Notify parent component about page change
  // }, [page, onPageChange]);

  const pages = getPageNumbers(totalPages, currentPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (!showPagination) return null; // Return null to not render anything if pagination should be hidden

  return (
    <div className={className}>
      <ol className="flex justify-center gap-2 text-base font-medium">
        {currentPage > 0 && (
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className="size-8 rounded border text-center flex items-center justify-center"
            >
              <span className="sr-only">Prev Page</span>
              <PrevArrow />
            </a>
          </li>
        )}

        {pages.map((pageNumber, index) => (
          <li key={index}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pageNumber !== "...") {
                  handlePageChange(pageNumber);
                }
              }}
              className={`size-8 rounded border text-center flex items-center justify-center ${
                pageNumber === currentPage
                  ? "border-secondary-300  -100 text-white"
                  : "border-whiteOpacity-100 bg-transparent  "
              }`}
              style={{ cursor: pageNumber === "..." ? "default" : "pointer" }}
            >
              {pageNumber}
            </a>
          </li>
        ))}

        {currentPage > 0 && (
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className="size-8 rounded border text-center flex items-center justify-center"
            >
              <span className="sr-only">Next Page</span>
              <NextArrow />
            </a>
          </li>
        )}
      </ol>
    </div>
  );
};

export default TablePagination;
