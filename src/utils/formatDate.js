export function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  
  const timeString = new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'short',
  }).format(date)
  
  const dateString = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
  }).format(date)

  return `${timeString}, ${dateString}`
}
