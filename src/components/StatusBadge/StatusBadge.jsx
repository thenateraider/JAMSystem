import { statusTone } from '../../utils/statusFlow'
import './StatusBadge.css'

function StatusBadge({ status }) {
  const tone = statusTone[status] || 'neutral'

  return <span className={`status-badge status-badge--${tone}`}>{status}</span>
}

export default StatusBadge
