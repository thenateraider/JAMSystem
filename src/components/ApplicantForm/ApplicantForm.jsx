import { useState, useEffect } from 'react'
import { APPLICANT_STATUSES, STATUS_TRANSITIONS } from '../../utils/statusFlow'
import './ApplicantForm.css'

function ApplicantForm({ applicants = [], initialData = null, onSaveIntent, onCancelIntent, onDeleteIntent }) {
  const isEditing = Boolean(initialData)
  const [isDirty, setIsDirty] = useState(false)

  // Validation States
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [shakeName, setShakeName] = useState(false)
  const [shakeEmail, setShakeEmail] = useState(false)
  const [shakePhone, setShakePhone] = useState(false)

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const validateEmail = (email) => {
    if (!email) {
      setEmailError('')
      return true
    }

    // Check Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.')
      return false
    }

    const isDuplicate = applicants.some(app => app.id !== initialData?.id && app.email === email)
    if (isDuplicate) {
      setEmailError('This Email is already registered.')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePhone = (phone) => {
    if (!phone) {
      setPhoneError('')
      return true
    }

    // Check Phone Format (Starts with 0, exactly 10 digits)
    const phoneRegex = /^0[0-9]{9}$/
    if (!phoneRegex.test(phone)) {
      setPhoneError('Phone number must start with 0 and have exactly 10 digits.')
      return false
    }

    const isDuplicate = applicants.some(app => app.id !== initialData?.id && app.phone === phone)
    if (isDuplicate) {
      setPhoneError('This phone number is already registered.')
      return false
    }
    setPhoneError('')
    return true
  }

  const validateName = (form) => {
    const title = form.title.value
    const name = form.name.value

    if (!name || !title) {
      setNameError('')
      return true
    }

    const fullName = `${title} ${name}`.toLowerCase()
    const isDuplicate = applicants.some(app =>
      app.id !== initialData?.id &&
      `${app.title} ${app.name}`.toLowerCase() === fullName
    )

    if (isDuplicate) {
      setNameError('This exact name and title is already registered.')
      return false
    }

    setNameError('')
    return true
  }

  const handleFormChange = (e) => {
    setIsDirty(true)
    if (e.target.name === 'email') validateEmail(e.target.value)
    if (e.target.name === 'phone') validatePhone(e.target.value)
    if (e.target.name === 'name' || e.target.name === 'title') validateName(e.target.form)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    const isNameValid = validateName(e.target)
    const isEmailValid = validateEmail(data.email)
    const isPhoneValid = validatePhone(data.phone)

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      if (!isNameValid) {
        setShakeName(true)
        setTimeout(() => setShakeName(false), 500)
      }
      if (!isEmailValid) {
        setShakeEmail(true)
        setTimeout(() => setShakeEmail(false), 500)
      }
      if (!isPhoneValid) {
        setShakePhone(true)
        setTimeout(() => setShakePhone(false), 500)
      }
      return
    }

    if (initialData?.id) {
      data.id = initialData.id
    }
    if (onSaveIntent) onSaveIntent(data)
  }

  const handleCancelClick = () => {
    if (onCancelIntent) onCancelIntent(isDirty)
  }

  // Determine allowed statuses based on current status (if editing)
  const currentStatus = initialData?.status || 'Applied'
  const allowedStatuses = isEditing ? STATUS_TRANSITIONS[currentStatus] : ['Applied']

  return (
    <div className="modal-overlay form-modal-overlay">
      <form className="applicant-form" onSubmit={handleSubmit} onChange={handleFormChange}>
        <header className="form-header">
          <h2>{isEditing ? 'Edit Applicant' : 'Add New Applicant'}</h2>
          <button type="button" className="close-btn" onClick={handleCancelClick} aria-label="Cancel">
            &times;
          </button>
        </header>

        <div className="form-grid">
          <label>
            <span>Title *</span>
            <select name="title" required defaultValue={initialData?.title || ''}>
              <option value="" disabled>Select</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Miss">Miss</option>
              <option value="Ms.">Ms.</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className={shakeName ? 'shake' : ''}>
            <span>Name *</span>
            <input type="text" name="name" required minLength="2" className={nameError ? 'input-error' : ''} defaultValue={initialData?.name || ''} placeholder="John Doe" />
            {nameError && <span className="error-text">{nameError}</span>}
          </label>

          <label className={shakeEmail ? 'shake' : ''}>
            <span>Email *</span>
            <input type="email" name="email" required className={emailError ? 'input-error' : ''} defaultValue={initialData?.email || ''} placeholder="john@example.com" />
            {emailError && <span className="error-text">{emailError}</span>}
          </label>

          <label className={shakePhone ? 'shake' : ''}>
            <span>Phone *</span>
            <input type="tel" name="phone" required pattern="0[0-9]{9}" title="Phone number must start with 0 and have exactly 10 digits" className={phoneError ? 'input-error' : ''} defaultValue={initialData?.phone || ''} placeholder="0812345678" />
            {phoneError && <span className="error-text">{phoneError}</span>}
          </label>

          <label className="full-width">
            <span>Position *</span>
            <input type="text" name="position" required minLength="2" defaultValue={initialData?.position || ''} placeholder="Position applying For.. (e.g. IT / Staff / Management)" />
          </label>

          <label className="full-width">
            <span>Status *</span>
            <select name="status" required defaultValue={currentStatus} disabled={allowedStatuses.length <= 1 && isEditing}>
              {allowedStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="full-width">
            <span>Note</span>
            <textarea name="note" rows="3" defaultValue={initialData?.note || ''} placeholder="Any additional notes..."></textarea>
          </label>
        </div>

        <footer className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancelClick}>Cancel</button>
          {isEditing && (
            <button type="button" className="btn-danger" onClick={() => onDeleteIntent?.(initialData)}>Delete</button>
          )}
          <button type="submit" className="btn-primary">Save Applicant</button>
        </footer>
      </form>
    </div>
  )
}

export default ApplicantForm
