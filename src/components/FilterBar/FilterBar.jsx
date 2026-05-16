import { APPLICANT_STATUSES } from '../../utils/statusFlow'
import './FilterBar.css'

function FilterBar({
  searchQuery, onSearchChange,
  statusFilter, onStatusChange
}) {
  return (
    <section className="filter-bar" aria-label="Applicant filters">
      <label>
        <span>Search</span>
        <input
          type="search"
          placeholder="Search by name, email, ID, or position..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
      <label>
        <span>Status</span>
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="">All statuses</option>
          {APPLICANT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}

export default FilterBar
