import StatusBadge from '../StatusBadge/StatusBadge'
import { formatDate } from '../../utils/formatDate'
import './ApplicantTable.css'

function ApplicantTable({ applicants, isLoading, onEdit, onDelete, sortConfig, onSortChange }) {
  if (isLoading) {
    return (
      <div className="table-state loading-state">
        <div className="spinner"></div>
        <p>Loading applicants...</p>
      </div>
    )
  }

  if (applicants.length === 0) {
    return (
      <div className="table-state empty-state">
        <p>No applicants found.</p>
      </div>
    )
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    onSortChange({ key, direction })
  }

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div className="applicant-table-wrap">
      <table className="applicant-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} className="sortable">ID{renderSortIcon('id')}</th>
            <th onClick={() => handleSort('name')} className="sortable">Name{renderSortIcon('name')}</th>
            <th onClick={() => handleSort('email')} className="sortable">Email{renderSortIcon('email')}</th>
            <th onClick={() => handleSort('phone')} className="sortable">Phone{renderSortIcon('phone')}</th>
            <th onClick={() => handleSort('position')} className="sortable">Position{renderSortIcon('position')}</th>
            <th onClick={() => handleSort('status')} className="sortable">Status{renderSortIcon('status')}</th>
            <th onClick={() => handleSort('updated_at')} className="sortable">Updated At{renderSortIcon('updated_at')}</th>
            <th onClick={() => handleSort('created_at')} className="sortable">Created At{renderSortIcon('created_at')}</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant.id}>
              <td className="applicant-id-col">{applicant.id}</td>
              <td><strong>{applicant.title} {applicant.name}</strong></td>
              <td>{applicant.email}</td>
              <td>{applicant.phone}</td>
              <td>{applicant.position}</td>
              <td>
                <StatusBadge status={applicant.status} />
              </td>
              <td>{formatDate(applicant.updated_at)}</td>
              <td>{formatDate(applicant.created_at)}</td>
              <td className="actions-cell">
                <div className="actions-wrap">
                  <button type="button" className="btn-icon edit-btn" onClick={() => onEdit?.(applicant)} aria-label="Edit">
                    ✎
                  </button>
                  <button type="button" className="btn-icon delete-btn" onClick={() => onDelete?.(applicant)} aria-label="Delete">
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ApplicantTable
