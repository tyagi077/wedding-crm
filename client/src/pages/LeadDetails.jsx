import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import api from '../services/api'

const LeadDetails = () => {

  const { id } = useParams()

  const [lead, setLead] = useState(null)

  const [saving, setSaving] = useState(false)
  const [activities, setActivities] =
  useState([])
  const [followupDate, setFollowupDate] = useState('')
  const [followupNote, setFollowupNote] = useState('')

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

  }, [])

  const saveLead = async () => {

    try {

      setSaving(true)

      const response = await api.put(
        `/leads/${id}`,
        lead
      )

      setLead(response.data)

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

    await api.post('/followups', {

      leadId: lead._id,

      followupDate,

      note: followupNote,

    })

    alert('Followup Scheduled')

    setFollowupDate('')
    setFollowupNote('')

  } catch (error) {

    console.log(error)

  }

}

  return (

    <div className='p-6'>

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

            <option value='NEW'>
              NEW
            </option>

            <option value='CONTACTED'>
              CONTACTED
            </option>

            <option value='INTERESTED'>
              INTERESTED
            </option>

            <option value='FOLLOW_UP'>
              FOLLOW UP
            </option>

            <option value='BOOKED'>
              BOOKED
            </option>

            <option value='LOST'>
              LOST
            </option>

          </select>

        </div>

      </div>

      {/* GRID */}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* LEFT */}

        <div className='lg:col-span-2 space-y-6'>

          {/* NOTES */}

          <div className='bg-white rounded-3xl shadow p-6'>

            <h2 className='text-2xl font-bold mb-4'>
              Notes
            </h2>

            <textarea
              value={lead.notes || ''}
              onChange={(e) =>
                setLead({
                  ...lead,
                  notes: e.target.value,
                })
              }
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
                  Budget
                </p>

                <p>
                  Not Added
                </p>

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
            type='datetime-local'
            value={followupDate}
            onChange={(e) =>
              setFollowupDate(e.target.value)
            }
            className='w-full border rounded-2xl p-4 mb-4'
          />

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

        </div>

        </div>

      </div>

    </div>

  )
}

export default LeadDetails