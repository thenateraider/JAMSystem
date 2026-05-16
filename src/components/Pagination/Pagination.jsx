import './Pagination.css'

function Pagination({ currentPage, totalPages, onNext, onPrev }) {
  return (
    <nav className="pagination" aria-label="Applicant pagination">
      <button 
        type="button" 
        disabled={currentPage <= 1}
        onClick={onPrev}
        aria-label="Previous page"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button 
        type="button" 
        disabled={currentPage >= totalPages}
        onClick={onNext}
        aria-label="Next page"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  )
}

export default Pagination
