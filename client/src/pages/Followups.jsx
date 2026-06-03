import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'

const getLeadId = (lead) => {

  if (!lead) {
    return null
  }

  if (typeof lead === 'string') {
    return lead
  }

  return lead._id || null

}

const isSameDay = (left, right) => {

  const leftDate = new Date(left)
  const rightDate = new Date(right)

  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  )

}

const Followups = () => {

  const [followups, setFollowups] = useState([])
  const [completionFilter, setCompletionFilter] = useState('ALL')
  const [updatingFollowupId, setUpdatingFollowupId] = useState(null)

  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchFollowups = async () => {

    try {

      const response = await api.get(
        '/followups'
      )

      setFollowups(
        response.data.sort(
          (left, right) =>
            new Date(left.followupDate) - new Date(right.followupDate)
        )
      )

      setLoading(false)

    } catch (error) {

      console.log(error)

      setLoading(false)

    }

  }

  useEffect(() => {

    fetchFollowups()

  }, [])

  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const endOfToday = new Date(now)
  endOfToday.setHours(23, 59, 59, 999)

  const filteredFollowups = followups.filter((item) => {

    if (completionFilter === 'PENDING') {
      return !item.completed
    }

    if (completionFilter === 'COMPLETED') {
      return item.completed
    }

    return true

  })

  const pastFollowups = filteredFollowups.filter(
    (item) => new Date(item.followupDate) < startOfToday
  )

  const todaysFollowups = filteredFollowups.filter(
    (item) => isSameDay(item.followupDate, now)
  )

  const upcomingFollowups = filteredFollowups.filter(
    (item) => new Date(item.followupDate) > endOfToday
  )

  const toggleCompleted = async (followup) => {

    const nextCompleted = !followup.completed

    setUpdatingFollowupId(followup._id)

    setFollowups((currentFollowups) =>
      currentFollowups.map((item) => (
        item._id === followup._id
          ? {
              ...item,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString() : null,
            }
          : item
      ))
    )

    try {

      await api.put(`/followups/${followup._id}`, {
        completed: nextCompleted,
      })

      fetchFollowups()

    } catch (error) {

      console.log(error)

      setFollowups((currentFollowups) =>
        currentFollowups.map((item) => (
          item._id === followup._id
            ? {
                ...item,
                completed: followup.completed,
                completedAt: followup.completedAt || null,
              }
            : item
        ))
      )

    }

    setUpdatingFollowupId(null)

  }

  const renderFollowupCard = (item) => (

    (() => {

      const leadId = getLeadId(item.leadId)

      return (

    <div
      key={item._id}
      role='button'
      tabIndex={0}
      onClick={() => {

        if (!leadId) {
          return
        }

        navigate(`/followups/${leadId}`)

      }}
      onKeyDown={(event) => {

        if (event.key === 'Enter' || event.key === ' ') {

          if (leadId) {
            navigate(`/followups/${leadId}`)
          }

        }

      }}
      className='w-full text-left bg-white rounded-3xl shadow p-6 hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer'
    >

      <div className='flex items-center justify-between gap-4'>

        <div>

          <h2 className='text-2xl font-semibold'>
            {item.leadId?.name}
          </h2>

          <p className='text-gray-500 mt-1'>
            {item.leadId?.phone}
          </p>

          <p className='text-gray-500'>
            {item.leadId?.city}
          </p>

        </div>

        <div className='text-right'>

          <p className='font-medium'>
            Followup Time
          </p>

          <p className='text-orange-500'>
            {new Date(item.followupDate).toLocaleString([], {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </p>

        </div>

      </div>

      <div className='mt-5 bg-gray-100 p-4 rounded-2xl'>

        <p className='text-gray-500 text-xs uppercase tracking-wide mb-2'>
          What to talk about
        </p>

        <p className='text-gray-700'>
          {item.note || 'No note added'}
        </p>

      </div>

      <div className='mt-4 flex items-center justify-between gap-3'>

        <span className={`text-xs px-3 py-1 rounded-full ${item.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {item.completed ? 'Completed' : 'Pending'}
        </span>

        <button
          type='button'
          disabled={updatingFollowupId === item._id}
          onClick={(event) => {
            event.stopPropagation()
            toggleCompleted(item)
          }}
          className='text-xs bg-black text-white px-3 py-2 rounded-xl disabled:opacity-60'
        >
          {updatingFollowupId === item._id
            ? 'Saving...'
            : item.completed
              ? 'Mark Pending'
              : 'Mark Completed'}
        </button>

      </div>

    </div>

      )

    })()

  )

  return (

    <div className='p-6'>

      {/* HEADER */}

      <div className='mb-8'>

        <h1 className='text-4xl font-bold'>
          Followups
        </h1>

        <p className='text-gray-500 mt-2'>
          Review past, today, and upcoming calls
        </p>

      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>

        <div className='bg-white rounded-3xl shadow p-5'>
          <p className='text-gray-500 text-sm'>Past Followups</p>
          <h2 className='text-3xl font-bold mt-2'>{pastFollowups.length}</h2>
        </div>

        <div className='bg-white rounded-3xl shadow p-5'>
          <p className='text-gray-500 text-sm'>Today</p>
          <h2 className='text-3xl font-bold mt-2'>{todaysFollowups.length}</h2>
        </div>

        <div className='bg-white rounded-3xl shadow p-5'>
          <p className='text-gray-500 text-sm'>Upcoming</p>
          <h2 className='text-3xl font-bold mt-2'>{upcomingFollowups.length}</h2>
        </div>

      </div>

      <div className='flex flex-wrap gap-3 mb-8'>

        {['ALL', 'PENDING', 'COMPLETED'].map((value) => (

          <button
            key={value}
            type='button'
            onClick={() => setCompletionFilter(value)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium ${completionFilter === value ? 'bg-black text-white' : 'bg-white text-gray-700 shadow'}`}
          >
            {value === 'ALL' ? 'All Followups' : value === 'PENDING' ? 'Pending' : 'Completed'}
          </button>

        ))}

      </div>

      {/* LOADING */}

      {
        loading && (
          <p>Loading...</p>
        )
      }

      {/* EMPTY */}

      {
        !loading && followups.length === 0 && (
          <div className='bg-white rounded-3xl shadow p-10 text-center'>

            <h2 className='text-2xl font-bold'>
              No followups found 🎉
            </h2>

          </div>
        )
      }

      <div className='space-y-8'>

        <section>

          <h2 className='text-2xl font-bold mb-4'>
            Past Followups
          </h2>

          {completionFilter === 'COMPLETED' ? (
            <p className='text-sm text-gray-500 mb-3'>Showing finished followups only.</p>
          ) : completionFilter === 'PENDING' ? (
            <p className='text-sm text-gray-500 mb-3'>Showing overdue pending followups.</p>
          ) : null}

          <div className='space-y-4'>
            {pastFollowups.map(renderFollowupCard)}
          </div>

        </section>

        <section>

          <h2 className='text-2xl font-bold mb-4'>
            Today's Followups
          </h2>

          {completionFilter === 'COMPLETED' ? (
            <p className='text-sm text-gray-500 mb-3'>Showing finished followups only.</p>
          ) : completionFilter === 'PENDING' ? (
            <p className='text-sm text-gray-500 mb-3'>Showing pending followups only.</p>
          ) : null}

          <div className='space-y-4'>
            {todaysFollowups.map(renderFollowupCard)}
          </div>

        </section>

        <section>

          <h2 className='text-2xl font-bold mb-4'>
            Upcoming Followups
          </h2>

          {completionFilter === 'COMPLETED' ? (
            <p className='text-sm text-gray-500 mb-3'>Showing finished followups only.</p>
          ) : completionFilter === 'PENDING' ? (
            <p className='text-sm text-gray-500 mb-3'>Showing pending followups only.</p>
          ) : null}

          <div className='space-y-4'>
            {upcomingFollowups.map(renderFollowupCard)}
          </div>

        </section>

      </div>

    </div>

  )
}

export default Followups