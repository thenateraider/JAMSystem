import { useState } from 'react'
import ApplicantForm from '../components/ApplicantForm/ApplicantForm'
import ApplicantTable from '../components/ApplicantTable/ApplicantTable'
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog'
import Toast from '../components/Toast/Toast'
import FilterBar from '../components/FilterBar/FilterBar'
import Pagination from '../components/Pagination/Pagination'
import { useApplicants } from '../hooks/useApplicants'
import './ApplicantsPage.css'

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const InboxIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

function ApplicantsPage() {
  const {
    applicants,
    error,
    isLoading,
    stats,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    sortConfig, setSortConfig,
    currentPage, setCurrentPage, totalPages,
    addApplicant, updateApplicant, deleteApplicant
  } = useApplicants()

  // UI States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingApplicant, setEditingApplicant] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Generic Confirm State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    intent: 'primary',
    onConfirm: () => { },
  })

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }))

  const handleAddNew = () => {
    setEditingApplicant(null)
    setIsFormOpen(true)
  }

  const handleEdit = (applicant) => {
    setEditingApplicant(applicant)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (applicant) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Applicant',
      message: `Are you sure you want to delete ${applicant.name}? This action cannot be undone.`,
      intent: 'danger',
      onConfirm: async () => {
        try {
          await deleteApplicant(applicant.id)
          setIsFormOpen(false)
          setEditingApplicant(null)
          closeConfirm()
          setTimeout(() => showToast('Applicant deleted successfully', 'success'), 150)
        } catch (err) {
          closeConfirm()
          setTimeout(() => showToast(err.message, 'error'), 150)
        }
      }
    })
  }

  const handleFormCancelIntent = (isDirty) => {
    if (isDirty) {
      setConfirmConfig({
        isOpen: true,
        title: 'Discard Changes?',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        intent: 'danger',
        onConfirm: () => {
          setIsFormOpen(false)
          setEditingApplicant(null)
          closeConfirm()
        }
      })
    } else {
      setIsFormOpen(false)
      setEditingApplicant(null)
    }
  }

  const handleFormSaveIntent = (formData) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Application Save',
      message: `Are you sure you want to save Application of "${formData.name}" ?`,
      intent: 'primary',
      onConfirm: async () => {
        try {
          if (formData.id) {
            await updateApplicant(formData.id, formData)
            setIsFormOpen(false)
            setEditingApplicant(null)
            closeConfirm()
            setTimeout(() => showToast('Applicant updated successfully', 'success'), 150)
          } else {
            await addApplicant(formData)
            setIsFormOpen(false)
            setEditingApplicant(null)
            closeConfirm()
            setTimeout(() => showToast('Applicant saved successfully', 'success'), 150)
          }
        } catch (err) {
          closeConfirm()
          setTimeout(() => showToast(err.message, 'error'), 150)
        }
      }
    })
  }

  return (
    <main className="applicants-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">JAMSystem</p>
          <h1>Job Application Management</h1>
          <p className="page-description">
            Track Applicants, Hiring Status, and Candidate Records Management.
          </p>
        </div>
        {!isFormOpen && (
          <button type="button" className="btn-primary add-applicant-btn" onClick={handleAddNew}>
            + Add New Applicant
          </button>
        )}
      </header>

      <section className="stat-grid" aria-label="Applicant summary">
        <article className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total</span>
            <strong className="stat-value">{stats.total || 0}</strong>
          </div>
          <div className="stat-icon stat-icon--total">
            <UsersIcon />
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Applied</span>
            <strong className="stat-value">{stats.Applied || 0}</strong>
          </div>
          <div className="stat-icon stat-icon--applied">
            <InboxIcon />
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Interview</span>
            <strong className="stat-value">{stats.Interview || 0}</strong>
          </div>
          <div className="stat-icon stat-icon--interview">
            <CalendarIcon />
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Passed</span>
            <strong className="stat-value">{stats.Passed || 0}</strong>
          </div>
          <div className="stat-icon stat-icon--passed">
            <CheckIcon />
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Rejected</span>
            <strong className="stat-value">{stats.Rejected || 0}</strong>
          </div>
          <div className="stat-icon stat-icon--rejected">
            <XIcon />
          </div>
        </article>
      </section>

      {isFormOpen && (
        <ApplicantForm
          applicants={applicants}
          initialData={editingApplicant}
          onSaveIntent={handleFormSaveIntent}
          onCancelIntent={handleFormCancelIntent}
          onDeleteIntent={handleDeleteClick}
        />
      )}

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {error ? <div className="error-banner">{error}</div> : null}

      <ApplicantTable
        applicants={applicants}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
      />

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        intent={confirmConfig.intent}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirm}
      />

      {toast?.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  )
}

export default ApplicantsPage
