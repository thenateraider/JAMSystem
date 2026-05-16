import { useEffect, useMemo, useState } from 'react'
import { fetchApplicants, createApplicantAPI, updateApplicantAPI, deleteApplicantAPI } from '../services/applicantApi'

const ITEMS_PER_PAGE = 10

export function useApplicants() {
  const [applicants, setApplicants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' })

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    async function loadApplicants() {
      try {
        setIsLoading(true)
        setError('')
        const data = await fetchApplicants()

        if (isMounted) {
          setApplicants(data)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load applicants. Please try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadApplicants()

    return () => {
      isMounted = false
    }
  }, [])

  // CRUD Operations
  const addApplicant = async (data) => {
    setIsLoading(true)
    try {
      // Check for duplicates locally to fail fast
      const isDuplicate = applicants.some(app => app.email === data.email || app.phone === data.phone)
      if (isDuplicate) {
        throw new Error('An applicant with this email or phone number already exists.')
      }

      const newApplicant = await createApplicantAPI(data)
      setApplicants(prev => [newApplicant, ...prev])
    } catch (err) {
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateApplicant = async (id, data) => {
    setIsLoading(true)
    try {
      // Check for duplicates excluding current applicant
      const isDuplicate = applicants.some(app => app.id !== id && (app.email === data.email || app.phone === data.phone))
      if (isDuplicate) {
        throw new Error('Another applicant is already using this email or phone number.')
      }

      const updatedApplicant = await updateApplicantAPI({ ...data, id })
      setApplicants(prev => prev.map(app => 
        app.id === id ? { ...app, ...updatedApplicant } : app
      ))
    } catch (err) {
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteApplicant = async (id) => {
    setIsLoading(true)
    try {
      await deleteApplicantAPI(id)
      setApplicants(prev => prev.filter(app => app.id !== id))
    } catch (err) {
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Derived State
  const filteredAndSortedApplicants = useMemo(() => {
    let result = [...applicants]

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(app => 
        app.name.toLowerCase().includes(lowerQuery) || 
        app.position.toLowerCase().includes(lowerQuery) ||
        app.email.toLowerCase().includes(lowerQuery) ||
        app.id.toLowerCase().includes(lowerQuery)
      )
    }

    // Status filter
    if (statusFilter) {
      result = result.filter(app => app.status === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      const key = sortConfig.key
      const direction = sortConfig.direction === 'asc' ? 1 : -1
      
      let valA = a[key]
      let valB = b[key]
      
      // Handle string comparison nicely
      if (typeof valA === 'string') {
        valA = valA.toLowerCase()
        valB = valB.toLowerCase()
      }

      if (valA < valB) return -1 * direction
      if (valA > valB) return 1 * direction
      return 0
    })

    return result
  }, [applicants, searchQuery, statusFilter, sortConfig])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedApplicants.length / ITEMS_PER_PAGE) || 1
  
  // Ensure current page is valid when filtering changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  const paginatedApplicants = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedApplicants.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAndSortedApplicants, currentPage])

  const stats = useMemo(() => {
    return applicants.reduce(
      (summary, applicant) => {
        summary.total += 1
        summary[applicant.status] = (summary[applicant.status] || 0) + 1
        return summary
      },
      { total: 0 },
    )
  }, [applicants])

  return {
    applicants: paginatedApplicants, // Return paginated for the table
    totalApplicants: applicants.length,
    error,
    isLoading,
    stats,
    // Filters & Sort
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    // CRUD
    addApplicant,
    updateApplicant,
    deleteApplicant
  }
}
