import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageNumbers: (number | string)[] = [];
  const maxPagesToShow = 5; // How many pages you want to display at once

  // Calculate which page numbers to show
  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (currentPage <= halfMaxPages) {
      // If the current page is near the start
      for (let i = 1; i <= maxPagesToShow - 2; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - halfMaxPages) {
      // If the current page is near the end
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = totalPages - maxPagesToShow + 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // If the current page is in the middle
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (
        let i = currentPage - halfMaxPages + 2;
        i <= currentPage + halfMaxPages - 1;
        i++
      ) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }
  }

  return (
    <div className="select-none flex items-center gap-1">
      {/* Previous Button */}
      <span
        className={`cursor-pointer  flex items-center justify-center rounded bg-[gray] w-[34px] h-[34px]`}
        onClick={() => {
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
          }
        }}
      >
        <BiChevronLeft />
      </span>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <span
          key={index}
          className={`${
            page === currentPage
              ? "active bg-gray-700 flex cursor-pointer items-center justify-center text-white rounded w-[34px] h-[34px]"
              : page === "..."
                ? "px-1"
                : " flex items-center cursor-pointer justify-center rounded bg-[gray] w-[34px] h-[34px]"
          }`}
          onClick={() => {
            if (typeof page === "number") {
              onPageChange(page);
            }
          }}
        >
          {page}
        </span>
      ))}

      {/* Next Button */}
      <span
        className={`cursor-pointer  flex items-center justify-center rounded bg-[gray] w-[34px] h-[34px]`}
        onClick={() => {
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
          }
        }}
      >
        <BiChevronRight />
      </span>
    </div>
  );
};

export default Pagination;
