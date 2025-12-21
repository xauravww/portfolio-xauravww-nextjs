import PropTypes from 'prop-types';
import { useMemo } from 'react';

const Pagination = ({ totalPosts, postPerPage, setcurrentPage, currentPage }) => {
    const totalPages = Math.ceil(totalPosts / postPerPage);
    const PAGE_LIMIT = 5; 

    const getPageRange = () => {
        let startPage, endPage;

        if (totalPages <= PAGE_LIMIT) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const halfLimit = Math.floor(PAGE_LIMIT / 2);
            if (currentPage <= halfLimit) {
                startPage = 1;
                endPage = PAGE_LIMIT;
            } else if (currentPage + halfLimit >= totalPages) {
                startPage = totalPages - PAGE_LIMIT + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - halfLimit;
                endPage = currentPage + halfLimit;
            }
        }

        return { startPage, endPage };
    };

    const { startPage, endPage } = useMemo(getPageRange, [currentPage, totalPages]);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination-container flex justify-center gap-1 md:gap-2 flex-wrap md:mt-5">
            {startPage > 1 && (
                <button
                    className={`text-lg md:text-xl lg:text-2xl font-bold rounded px-3 py-1 transition-colors duration-200 bg-transparent text-[var(--text-medium)] border border-[var(--border-color)] hover:bg-[var(--border-color)] hover:text-[var(--text-light)]`}
                    onClick={() => setcurrentPage(1)}
                >
                    1
                </button>
            )}
            {startPage > 2 && <span className="text-[var(--text-medium)] text-lg md:text-xl lg:text-2xl px-1 md:px-2 font-bold">...</span>}
            
            {pages.map((page) => (
                <button
                    key={page}
                    className={`text-lg md:text-xl lg:text-2xl font-bold rounded px-3 py-1 transition-colors duration-200 ${
                      page === currentPage
                        ? 'bg-[#f3d800] text-[#1A1D24] border border-[#f3d800]'
                        : 'bg-transparent text-[var(--text-medium)] border border-[var(--border-color)] hover:bg-[var(--border-color)] hover:text-[var(--text-light)]'
                    }`}
                    onClick={() => setcurrentPage(page)}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages - 1 && <span className="text-[var(--text-medium)] text-sm md:text-xl lg:text-2xl px-1 md:px-2 font-bold">...</span>}
            {endPage < totalPages && (
                <button
                    className={`text-lg md:text-xl lg:text-2xl font-bold rounded px-3 py-1 transition-colors duration-200 bg-transparent text-[var(--text-medium)] border border-[var(--border-color)] hover:bg-[var(--border-color)] hover:text-[var(--text-light)]`}
                    onClick={() => setcurrentPage(totalPages)}
                >
                    {totalPages}
                </button>
            )}
        </div>
    );
};

Pagination.propTypes = {
    totalPosts: PropTypes.number.isRequired,
    postPerPage: PropTypes.number.isRequired,
    setcurrentPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
};

export default Pagination;
