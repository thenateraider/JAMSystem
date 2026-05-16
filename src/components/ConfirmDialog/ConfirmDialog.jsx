import { useEffect, useState } from 'react'
import './ConfirmDialog.css'

function ConfirmDialog({ 
  isOpen, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  intent = 'primary', // 'primary' or 'danger'
  onConfirm, 
  onCancel 
}) {
  const [isProcessing, setIsProcessing] = useState(false)

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsProcessing(false) // Reset on open
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleConfirmClick = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="modal-dialog">
        <h3 id="dialog-title">{title}</h3>
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={isProcessing}>
            {cancelText}
          </button>
          <button type="button" className={`btn-${intent}`} onClick={handleConfirmClick} disabled={isProcessing}>
            {isProcessing ? <span className="spinner-small"></span> : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
