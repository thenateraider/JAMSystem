export const APPLICANT_STATUSES = ['Applied', 'Interview', 'Passed', 'Rejected']

export const statusTone = {
  Applied: 'neutral',
  Interview: 'info',
  Passed: 'success',
  Rejected: 'danger',
}

export const STATUS_TRANSITIONS = {
  Applied: ['Applied', 'Interview', 'Rejected'],
  Interview: ['Interview', 'Passed', 'Rejected'],
  Passed: ['Passed'],
  Rejected: ['Rejected']
}
