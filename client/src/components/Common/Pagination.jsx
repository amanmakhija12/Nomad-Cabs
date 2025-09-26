const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  position = "fixed", // "fixed" | "relative" | "sticky"
  maxVisiblePages = 5,
  showLabels = true,
  size = "md", // "sm" | "md" | "lg"
  variant = "light", // "light" | "dark"
}) => {
  if (totalPages <= 1) return null;

  // Calculate visible page range
  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    if (end - start + 1 < maxVisiblePages)
      start = Math.max(1, end - maxVisiblePages + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  // Size classes
  const sizeClasses = {
    sm: "px-2 py-1 text-sm min-w-[2rem]",
    md: "px-4 py-2 min-w-[3rem]",
    lg: "px-6 py-3 text-lg min-w-[4rem]",
  };

  // Position classes
  const positionClasses = {
    fixed:
      variant === "dark"
        ? "fixed bottom-0 left-0 right-0 py-6 z-10 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/95 to-transparent backdrop-blur-md border-t border-white/10"
        : "fixed bottom-0 left-0 right-0 py-6 z-10 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-md border-t border-gray-200",
    relative: "relative py-4",
    sticky:
      variant === "dark"
        ? "sticky bottom-0 py-4 bg-[#0f0f0f]/95 backdrop-blur-md border-t border-white/10 z-10"
        : "sticky bottom-0 py-4 bg-white/95 backdrop-blur-md border-t border-gray-200 z-10",
  };

  const baseBtn =
    variant === "dark"
      ? "rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
      : "rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600";

  const activeBtn =
    variant === "dark"
      ? "bg-white text-black"
      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-110";

  const container = positionClasses[position];

  return (
    <div className={container}>
      <div className="flex justify-center items-center space-x-3 overflow-x-auto px-4">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`${sizeClasses[size]} ${baseBtn} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1`}
        >
          {showLabels && <span className="hidden sm:inline">Previous</span>}
        </button>

        <div className="flex space-x-2">
          {/* First page */}
          {visiblePages[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className={`${sizeClasses[size]} ${baseBtn} font-semibold transition-all duration-200`}
              >
                1
              </button>
              {visiblePages[0] > 2 && (
                <span
                  className={
                    variant === "dark"
                      ? "px-2 py-2 text-gray-500"
                      : "px-2 py-2 text-gray-400"
                  }
                >
                  ...
                </span>
              )}
            </>
          )}

          {/* Visible pages */}
          {visiblePages.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`${sizeClasses[size]} ${
                pageNum === currentPage ? activeBtn : baseBtn
              } font-semibold transition-all duration-200`}
            >
              {pageNum}
            </button>
          ))}

          {/* Last page */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span
                  className={
                    variant === "dark"
                      ? "px-2 py-2 text-gray-500"
                      : "px-2 py-2 text-gray-400"
                  }
                >
                  ...
                </span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className={`${sizeClasses[size]} ${baseBtn} font-semibold transition-all duration-200`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`${sizeClasses[size]} ${baseBtn} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1`}
        >
          {showLabels && <span className="hidden sm:inline">Next</span>}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
