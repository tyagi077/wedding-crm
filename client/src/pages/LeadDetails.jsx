import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarPlus, StickyNote } from 'lucide-react'

import api from '../services/api'

const statuses = [
  'NEW',
  'CONTACTED',
  'INTERESTED',
  'FOLLOW_UP',
  'BOOKED',
  'LOST',
]

const statusLabels = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  INTERESTED: 'Interested',
  FOLLOW_UP: 'Follow Up',
  BOOKED: 'Booked',
  LOST: 'Lost',
}

const formatDate = (value) => {

  if (!value) {
    return 'Not added'
  }

  return new Date(value).toLocaleDateString()

}

const followupTimeOptions = Array.from({ length: 24 }, (_, index) => {

  const hour24 = index.toString().padStart(2, '0')
  const hour12 = index % 12 === 0 ? 12 : index % 12
  const period = index < 12 ? 'AM' : 'PM'

  return {
    value: `${hour24}:00`,
    label: `${hour12}:00 ${period}`,
  }

})

const LeadDetails = () => {

  const { id } = useParams()

  const [lead, setLead] = useState(null)

  const [saving, setSaving] = useState(false)
  const [activities, setActivities] =
  useState([])
  const [followupDate, setFollowupDate] = useState('')
  const [followupTime, setFollowupTime] = useState('17:00')
  const [followupNote, setFollowupNote] = useState('')
  const notesRef = useRef(null)
  const followupRef = useRef(null)

  const fetchLead = async () => {

    try {

      const response = await api.get(`/leads/${id}`)

      setLead(response.data)

    } catch (error) {

      console.log(error)

    }

  }
  const fetchActivities = async () => {

  try {

    const response = await api.get(
      `/activities/${id}`
    )

    setActivities(response.data)

  } catch (error) {

    console.log(error)

  }

}


  useEffect(() => {

    fetchLead()
    fetchActivities()

  }, [id])

  const saveLead = async () => {

    try {

      setSaving(true)

      const response = await api.put(
        `/leads/${id}`,
        lead
      )

      setLead(response.data)
      fetchActivities()

      setSaving(false)

      alert('Lead Updated')

    } catch (error) {

      console.log(error)

      setSaving(false)

    }

  }

  if (!lead) {
    return <h1 className='p-6'>Loading...</h1>
  }

  const saveFollowup = async () => {

  try {

    if (!followupDate || !followupTime) {
      alert('Please select a followup date and time.')
      return
    }

    const scheduledFollowupDate = new Date(
      `${followupDate}T${followupTime}`
    )

    await api.post('/followups', {

      leadId: lead._id,

      followupDate: scheduledFollowupDate,

      note: followupNote,

    })

    alert('Followup Scheduled')

    setFollowupDate('')
  setFollowupTime('17:00')
    setFollowupNote('')
    fetchActivities()
    fetchLead()

  } catch (error) {

    console.log(error)

  }

}

  const callCount = activities.filter((activity) =>
    activity.message.toLowerCase().includes('followup')
  ).length

  const totalActivityCount = activities.length

  const openNotes = () => {

    notesRef.current?.focus()
    notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  }

  const openFollowup = () => {

    followupRef.current?.focus()
    followupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  }

  return (

    <div className='p-6 max-w-full overflow-x-hidden'>

      {/* TOP SECTION */}

      <div className='bg-white rounded-3xl shadow p-6 mb-6'>

        <div className='flex items-center justify-between'>

          <div>

            <h1 className='text-4xl font-bold'>
              {lead.name}
            </h1>

            <p className='text-gray-500 mt-2'>
              {lead.phone}
            </p>

            <p className='text-gray-500'>
              {lead.city}
            </p>

            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600'>

              <p>
                Email: {lead.email || 'Not added'}
              </p>

              <p>
                Event Type: {lead.eventType || 'Not added'}
              </p>

              <p>
                Budget: {lead.budget || 'Not added'}
              </p>

              <p>
                Follow-up: {formatDate(lead.followUpDate)}
              </p>

            </div>

          </div>

          {/* STATUS */}

          <select
            value={lead.status}
            onChange={(e) =>
              setLead({
                ...lead,
                status: e.target.value,
              })
            }
            className='border rounded-xl px-4 py-2'
          >

            {
              statuses.map((status) => (

                <option
                  key={status}
                  value={status}
                >

                  {statusLabels[status] || status}

                </option>

              ))
            }

          </select>

        </div>

        <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4'>

          <div className='rounded-2xl bg-gray-50 p-4'>
            <p className='text-gray-500 text-sm'>Total Activity</p>
            <h3 className='text-2xl font-bold mt-1'>{totalActivityCount}</h3>
          </div>

          <div className='rounded-2xl bg-gray-50 p-4'>
            <p className='text-gray-500 text-sm'>Calls / Follow-ups</p>
            <h3 className='text-2xl font-bold mt-1'>{callCount}</h3>
          </div>

          <div className='rounded-2xl bg-gray-50 p-4 flex items-center justify-between gap-3'>
            <div>
              <p className='text-gray-500 text-sm'>Quick Actions</p>
              <p className='text-sm text-gray-600 mt-1'>Jump to notes or follow-up</p>
            </div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={openNotes}
                className='rounded-xl bg-white border px-3 py-2 text-sm'
                title='Add note'
              >
                <StickyNote size={18} />
              </button>
              <button
                type='button'
                onClick={openFollowup}
                className='rounded-xl bg-white border px-3 py-2 text-sm'
                title='Schedule follow-up'
              >
                <CalendarPlus size={18} />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* GRID */}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* LEFT */}

        <div className='lg:col-span-2 space-y-6'>

          {/* NOTES */}

          <div className='bg-white rounded-3xl shadow p-6'>

            <div className='flex items-center justify-between mb-4'>

              <h2 className='text-2xl font-bold'>
                Notes
              </h2>

              <button
                type='button'
                onClick={openNotes}
                className='text-sm bg-gray-100 px-3 py-2 rounded-xl'
              >
                Add Note 📝
              </button>

            </div>

            <textarea
              value={lead.notes || ''}
              onChange={(e) =>
                setLead({
                  ...lead,
                  notes: e.target.value,
                })
              }
              ref={notesRef}
              placeholder='Write client notes...'
              className='w-full border rounded-2xl p-4 h-40 outline-none'
            />

            <button
              onClick={saveLead}
              className='bg-black text-white px-6 py-3 rounded-2xl mt-4'
            >

              {
                saving
                  ? 'Saving...'
                  : 'Save Changes'
              }

            </button>

          </div>

          {/* TIMELINE */}

          <div className='bg-white rounded-3xl shadow p-6'>

  <h2 className='text-2xl font-bold mb-4'>
    Activity Timeline
  </h2>

  <p className='text-gray-500 text-sm mb-4'>
    Track every call, note, and follow-up from this lead.
  </p>

  <div className='space-y-4'>

    {
      activities.map((activity) => (

        <div
          key={activity._id}
          className='border-l-4 border-black pl-4'
        >

          <p className='font-medium'>
            {activity.message}
          </p>

          <p className='text-gray-500 text-sm'>

            {
              new Date(
                activity.createdAt
              ).toLocaleString()
            }

          </p>

        </div>

      ))
    }

  </div>

</div>

        </div>

        {/* RIGHT */}

        <div className='space-y-6'>

          {/* CLIENT INFO */}

          <div className='bg-white rounded-3xl shadow p-6'>

            <h2 className='text-2xl font-bold mb-4'>
              Client Info
            </h2>

            <div className='space-y-3'>

              <div>

                <p className='text-gray-500 text-sm'>
                  Email
                </p>

                <input
                  type='email'
                  value={lead.email || ''}
                  onChange={(e) =>
                    setLead({
                      ...lead,
                      email: e.target.value,
                    })
                  }
                  className='border rounded-xl p-2 w-full mt-2'
                  placeholder='Client email'
                />

              </div>

              <div>

                <p className='text-gray-500 text-sm'>
                  Event Type
                </p>

                <input
                  type='text'
                  value={lead.eventType || ''}
                  onChange={(e) =>
                    setLead({
                      ...lead,
                      eventType: e.target.value,
                    })
                  }
                  className='border rounded-xl p-2 w-full mt-2'
                  placeholder='Wedding, reception, engagement...'
                />

              </div>

              <div>

                <p className='text-gray-500 text-sm'>
                  Budget
                </p>

                <input
                  type='text'
                  value={lead.budget || ''}
                  onChange={(e) =>
                    setLead({
                      ...lead,
                      budget: e.target.value,
                    })
                  }
                  className='border rounded-xl p-2 w-full mt-2'
                  placeholder='Budget'
                />

              </div>

              <div>

                <p className='text-gray-500 text-sm'>
                  Wedding Date
                </p>

                <input
                  type='date'
                  value={
                    lead.weddingDate
                      ? lead.weddingDate.split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setLead({
                      ...lead,
                      weddingDate: e.target.value,
                    })
                  }
                  className='border rounded-xl p-2 w-full mt-2'
                />

              </div>

              <div>

                <p className='text-gray-500 text-sm'>
                  Next Follow-up
                </p>

                <input
                  type='date'
                  value={
                    lead.followUpDate
                      ? lead.followUpDate.split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setLead({
                      ...lead,
                      followUpDate: e.target.value,
                    })
                  }
                  className='border rounded-xl p-2 w-full mt-2'
                />

              </div>

              <div>

                <p className='text-gray-500 text-sm'>
                  Priority
                </p>

                <p>
                  Warm Lead
                </p>

              </div>

            </div>

          </div>

          {/* FOLLOWUP */}
         
        <div className='bg-white rounded-3xl shadow p-6'>

          <h2 className='text-2xl font-bold mb-4'>
            Schedule Followup
          </h2>

          <input
            type='date'
            value={followupDate}
            onChange={(e) =>
              setFollowupDate(e.target.value)
            }
            ref={followupRef}
            className='w-full border rounded-2xl p-4 mb-4'
          />

          <select
            value={followupTime}
            onChange={(e) =>
              setFollowupTime(e.target.value)
            }
            className='w-full border rounded-2xl p-4 mb-4'
          >

            {
              followupTimeOptions.map((option) => (

                <option
                  key={option.value}
                  value={option.value}
                >

                  {option.label}

                </option>

              ))
            }

          </select>

          <textarea
            placeholder='Followup notes'
            value={followupNote}
            onChange={(e) =>
              setFollowupNote(e.target.value)
            }
            className='w-full border rounded-2xl p-4 mb-4 h-28'
          />

          <button
            onClick={saveFollowup}
            className='w-full bg-black text-white py-4 rounded-2xl'
          >
            Save Followup
          </button>

          <button
            type='button'
            onClick={openFollowup}
            className='w-full mt-3 border rounded-2xl py-3 text-sm'
          >
            Add another follow-up
          </button>

        </div>

        </div>

      </div>

    </div>

  )
}

export default LeadDetails