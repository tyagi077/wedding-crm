import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarPlus, StickyNote } from 'lucide-react'

import api from '../services/api'

const timeOptions = Array.from({ length: 24 }, (_, index) => {

  const hour24 = index.toString().padStart(2, '0')
  const hour12 = index % 12 === 0 ? 12 : index % 12
  const period = index < 12 ? 'AM' : 'PM'

  return {
    value: `${hour24}:00`,
    label: `${hour12}:00 ${period}`,
  }

})

const formatDateTime = (value) => {

  if (!value) {
    return 'Not scheduled'
  }

  return new Date(value).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

}

const resolveLeadId = (value) => {

  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    return value
  }

  return value._id || null

}

const LeadConversation = () => {

  const { leadId } = useParams()
  const navigate = useNavigate()
  const resolvedLeadId = resolveLeadId(leadId)

  const [lead, setLead] = useState(null)
  const [activities, setActivities] = useState([])
  const [followups, setFollowups] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [followupNote, setFollowupNote] = useState('')
  const [followupDay, setFollowupDay] = useState('')
  const [followupTime, setFollowupTime] = useState('17:00')

  const fetchData = async () => {

    try {

      const [leadResponse, activitiesResponse] = await Promise.all([
        api.get(`/leads/${resolvedLeadId}`),
        api.get(`/activities/${resolvedLeadId}`),
      ])

      let followupList = []

      try {

        const followupsResponse = await api.get(`/followups/lead/${resolvedLeadId}`)
        followupList = followupsResponse.data

      } catch (followupError) {

        console.log(followupError)

      }

      setLead(leadResponse.data)
      setActivities(activitiesResponse.data)
      setFollowups(followupList)
      setLoading(false)

    } catch (error) {

      console.log(error)
      setLoading(false)

    }

  }

  useEffect(() => {

    fetchData()

  }, [resolvedLeadId])

  const timeline = useMemo(() => {

    const activityItems = activities.map((activity) => ({
      id: activity._id,
      type: 'activity',
      title: activity.message,
      description: 'Logged activity',
      date: activity.createdAt,
    }))

    const followupItems = followups.map((item) => ({
      id: item._id,
      type: 'followup',
      title: item.completed ? 'Completed follow-up' : 'Scheduled follow-up',
      description: item.note || 'No talking points added',
      date: item.followupDate,
      completed: item.completed,
    }))

    return [...activityItems, ...followupItems].sort(
      (left, right) => new Date(right.date) - new Date(left.date)
    )

  }, [activities, followups])

  const currentFollowup = followups.find((item) => !item.completed) || followups[0]

  const saveFollowup = async (event) => {

    event.preventDefault()

    try {

      if (!followupDay || !followupTime) {
        alert('Please choose both a date and time.')
        return
      }

      setSaving(true)

      const followupDate = new Date(`${followupDay}T${followupTime}`)

      await api.post('/followups', {
        leadId: resolvedLeadId,
        followupDate,
        note: followupNote,
      })

      setFollowupNote('')
      setFollowupDay('')
      setFollowupTime('17:00')
      await fetchData()

    } catch (error) {

      console.log(error)

    } finally {

      setSaving(false)

    }

  }

  const toggleCompleted = async (item) => {

    try {

      await api.put(`/followups/${item.id}`, {
        completed: !item.completed,
      })

      fetchData()

    } catch (error) {

      console.log(error)

    }

  }

  if (loading) {
    return <div className='p-6'>Loading...</div>
  }

  if (!resolvedLeadId) {
    return <div className='p-6'>Missing lead id</div>
  }

  if (!lead) {
    return <div className='p-6'>Lead not found</div>
  }

  return (

    <div className='p-6 space-y-6'>

      <div className='flex items-center justify-between gap-4 flex-wrap'>

        <div>

          <button
            type='button'
            onClick={() => navigate(-1)}
            className='text-sm text-gray-500 mb-3'
          >
            Back
          </button>

          <h1 className='text-4xl font-bold'>
            {lead.name}
          </h1>

          <p className='text-gray-500 mt-2'>
            {lead.phone} · {lead.city}
          </p>

          <p className='text-gray-500'>
            {lead.email || 'No email added'}
          </p>

        </div>

        <div className='flex gap-2 flex-wrap'>

          <button
            type='button'
            onClick={() => document.getElementById('conversation-note')?.focus()}
            className='rounded-xl border bg-white px-3 py-2 flex items-center gap-2'
          >
            <StickyNote size={16} />
            Add Note
          </button>

          <button
            type='button'
            onClick={() => document.getElementById('followup-form')?.scrollIntoView({ behavior: 'smooth' })}
            className='rounded-xl border bg-white px-3 py-2 flex items-center gap-2'
          >
            <CalendarPlus size={16} />
            Schedule Follow-up
          </button>

          <button
            type='button'
            onClick={() => navigate(`/leads/${resolvedLeadId}`)}
            className='rounded-xl border bg-black text-white px-3 py-2'
          >
            Open Lead Details
          </button>

        </div>

      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>

        <div className='xl:col-span-2 space-y-6'>

          <div className='bg-white rounded-3xl shadow p-6'>

            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-bold'>Conversation History</h2>
              <span className='text-sm text-gray-500'>{timeline.length} entries</span>
            </div>

            <div className='space-y-4 max-h-[70vh] overflow-y-auto pr-1'>

              {timeline.map((item) => (

                <div key={`${item.type}-${item.id}`} className='border-l-4 border-black pl-4'>

                  <div className='flex items-center justify-between gap-3'>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-xs text-gray-400'>
                      {formatDateTime(item.date)}
                    </p>
                  </div>

                  <p className='text-gray-600 text-sm mt-1'>
                    {item.description}
                  </p>

                  {item.type === 'followup' ? (

                    <div className='mt-3 flex items-center justify-between gap-3'>

                      <span className={`text-xs px-3 py-1 rounded-full ${item.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.completed ? 'Completed' : 'Pending'}
                      </span>

                      <button
                        type='button'
                        onClick={() => toggleCompleted(item)}
                        className='text-xs bg-black text-white px-3 py-2 rounded-xl'
                      >
                        {item.completed ? 'Mark Pending' : 'Mark Completed'}
                      </button>

                    </div>

                  ) : null}

                </div>

              ))}

            </div>

          </div>

        </div>

        <div className='space-y-6'>

          <div className='bg-white rounded-3xl shadow p-6'>

            <h2 className='text-2xl font-bold mb-4'>
              Current Follow-up Note
            </h2>

            <p className='text-gray-500 text-sm mb-4'>
              Write exactly what you want to discuss on the next call.
            </p>

            {currentFollowup ? (

              <div className='mb-4 rounded-2xl bg-gray-50 p-4'>

                <p className='text-xs uppercase tracking-wide text-gray-500'>
                  Next talking points
                </p>

                <p className='font-medium mt-2'>
                  {currentFollowup.note || 'No note added'}
                </p>

                <p className='text-sm text-gray-500 mt-1'>
                  {formatDateTime(currentFollowup.followupDate)}
                </p>

              </div>

            ) : null}

            <form id='followup-form' onSubmit={saveFollowup} className='space-y-4'>

              <textarea
                id='conversation-note'
                value={followupNote}
                onChange={(event) => setFollowupNote(event.target.value)}
                placeholder='Talk about venue, budget, package, or next decision...'
                className='w-full border rounded-2xl p-4 h-36 outline-none'
              />

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>

                <input
                  type='date'
                  value={followupDay}
                  onChange={(event) => setFollowupDay(event.target.value)}
                  className='w-full border rounded-2xl p-3'
                />

                <select
                  value={followupTime}
                  onChange={(event) => setFollowupTime(event.target.value)}
                  className='w-full border rounded-2xl p-3'
                >

                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}

                </select>

              </div>

              <button
                type='submit'
                disabled={saving}
                className='w-full bg-black text-white py-4 rounded-2xl disabled:opacity-60'
              >
                {saving ? 'Saving...' : 'Save Follow-up'}
              </button>

            </form>

          </div>

          <div className='bg-white rounded-3xl shadow p-6'>

            <h2 className='text-2xl font-bold mb-4'>
              Lead Snapshot
            </h2>

            <div className='space-y-3 text-sm text-gray-700'>
              <p>Status: {lead.status}</p>
              <p>Event Type: {lead.eventType || 'Not added'}</p>
              <p>Budget: {lead.budget || 'Not added'}</p>
              <p>Wedding Date: {lead.weddingDate ? new Date(lead.weddingDate).toLocaleDateString() : 'Not added'}</p>
            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default LeadConversation