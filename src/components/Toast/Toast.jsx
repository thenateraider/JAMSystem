import { useEffect, useState } from 'react'
import './Toast.css'

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

export default function Toast({ message, type = 'success', onClose }) {
  const [isHiding, setIsHiding] = useState(false)

  useEffect(() => {
    // Start exit animation slightly before unmount
    const timer = setTimeout(() => {
      setIsHiding(true)
    }, 4700)

    // Actually remove the component
    const removeTimer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [onClose])

  if (!message) return null

  return (
    <div className={`toast-container ${isHiding ? 'toast-hide' : 'toast-show'}`}>
      <div className={`toast-content toast-${type}`}>
        <span className="toast-icon">
          {type === 'success' ? <CheckIcon /> : <ErrorIcon />}
        </span>
        <p className="toast-message">{message}</p>
        <button type="button" className="toast-close" onClick={() => {
          setIsHiding(true)
          setTimeout(onClose, 300)
        }}>
          &times;
        </button>
      </div>
    </div>
  )
}
