export const API_URL = 'https://script.google.com/macros/s/AKfycbxHt19LJqfwMfJwt63jKGOoemFopl3rbXGg2AxAUy1a6s_OyZCMEzXJZOGzxZRYsm94eg/exec'

export async function fetchApplicants() {
  try {
    const response = await fetch(API_URL)
    const result = await response.json()

    if (result.status !== 'success') {
      throw new Error(result.message || 'Failed to fetch applicants')
    }

    return result.data || []
  } catch (error) {
    console.error('Error fetching applicants:', error)
    throw new Error('Unable to connect to the database. Please check your internet connection or API settings.')
  }
}

export async function createApplicantAPI(data) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'create', data }),
    })
    const result = await response.json()

    if (result.status !== 'success') {
      throw new Error(result.message || 'Failed to create applicant')
    }

    return result.data
  } catch (error) {
    console.error('Error creating applicant:', error)
    throw new Error(error.message || 'An error occurred while communicating with the server.')
  }
}

export async function updateApplicantAPI(data) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'update', data }),
    })
    const result = await response.json()

    if (result.status !== 'success') {
      throw new Error(result.message || 'Failed to update applicant')
    }

    return result.data
  } catch (error) {
    console.error('Error updating applicant:', error)
    throw new Error(error.message || 'An error occurred while communicating with the server.')
  }
}

export async function deleteApplicantAPI(id) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'delete', id }),
    })
    const result = await response.json()

    if (result.status !== 'success') {
      throw new Error(result.message || 'Failed to delete applicant')
    }

    return true
  } catch (error) {
    console.error('Error deleting applicant:', error)
    throw new Error(error.message || 'An error occurred while communicating with the server.')
  }
}
