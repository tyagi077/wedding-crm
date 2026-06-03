import { useEffect, useState } from 'react'

import moment from 'moment'
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

const CalendarPage = () => {

  const [events, setEvents] = useState([])
  const [currentMonth, setCurrentMonth] = useState(
    moment().startOf('month')
  )
  const navigate = useNavigate()

  const formatDayKey = (date) =>
    moment(date).format('YYYY-MM-DD')

  const fetchData = async () => {

    try {

      const leadsResponse =
        await api.get('/leads')

      const followupResponse =
       await api.get('/followups')

      // WEDDING EVENTS

      const weddingEvents =
        leadsResponse.data
          .filter((lead) => lead.weddingDate)
          .map((lead) => ({

            title: `💍 ${lead.name} Wedding`,

            start: new Date(lead.weddingDate),

            end: new Date(lead.weddingDate),

            leadId: getLeadId(lead._id),

            type: 'Wedding',

          }))

      // FOLLOWUP EVENTS

      const followupEvents =
        followupResponse.data.map((item) => ({

          title:
         `${item.leadId?.name} Followup`,

          start: new Date(item.followupDate),

          end: new Date(item.followupDate),

          leadId: getLeadId(item.leadId),

          type: 'Followup',

        }))

        
      setEvents([
        ...weddingEvents,
        ...followupEvents,
      ])

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    fetchData()

  }, [])

  const monthStart = currentMonth.clone().startOf('month').startOf('week')
  const monthEnd = currentMonth.clone().endOf('month').endOf('week')
  const days = []

  const cursor = monthStart.clone()
  while (cursor.isSameOrBefore(monthEnd, 'day')) {
    days.push(cursor.clone())
    cursor.add(1, 'day')
  }

  const eventsByDay = events.reduce((accumulator, event) => {
    const key = formatDayKey(event.start)
    accumulator[key] = accumulator[key] || []
    accumulator[key].push(event)
    return accumulator
  }, {})

  const goToLead = (leadId, type) => {

    if (!leadId) {
      return
    }

    if (type === 'Followup') {
      navigate(`/followups/${leadId}`)
      return
    }

    navigate(`/leads/${leadId}`)

  }

  return (

    <div className='p-6'>

      {/* HEADER */}

      <div className='mb-8'>

        <h1 className='text-4xl font-bold'>
          Calendar
        </h1>

        <p className='text-gray-500 mt-2'>
          Weddings & Followups
        </p>

      </div>

      <div className='flex items-center justify-between mb-4 gap-4'>

        <button
          onClick={() => setCurrentMonth((value) => value.clone().subtract(1, 'month'))}
          className='bg-white rounded-2xl shadow px-4 py-2'
        >
          Previous
        </button>

        <h2 className='text-2xl font-bold'>
          {currentMonth.format('MMMM YYYY')}
        </h2>

        <button
          onClick={() => setCurrentMonth((value) => value.clone().add(1, 'month'))}
          className='bg-white rounded-2xl shadow px-4 py-2'
        >
          Next
        </button>

      </div>

      <div className='flex justify-end mb-4'>

        <button
          onClick={() => setCurrentMonth(moment().startOf('month'))}
          className='text-sm text-gray-600 underline'
        >
          Today
        </button>

      </div>

      {/* CALENDAR */}

      <div className='bg-white rounded-3xl shadow p-4 md:p-6'>

        <div className='grid grid-cols-7 gap-2 mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>

          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className='px-2 py-1'>
              {day}
            </div>
          ))}

        </div>

        <div className='grid grid-cols-7 gap-2'>

          {days.map((day) => {

            const key = formatDayKey(day)
            const dayEvents = eventsByDay[key] || []
            const isCurrentMonth = day.month() === currentMonth.month()
            const isToday =day.isSame(moment(), 'day')

            return (

  <div
    key={key}
    className={`
      rounded-2xl p-2 min-h-[160px] flex flex-col transition-all border
      ${
        isToday
          ? 'bg-blue-50 text-white border-blue-300 shadow-lg'
          : isCurrentMonth
          ? 'bg-gray-50'
          : 'bg-gray-100/60 text-gray-400'
      }
    `}
  >

    <div className='flex items-center justify-between mb-2'>

      <span className='text-sm font-semibold'>
        {day.date()}
      </span>

      {dayEvents.length > 0 ? (
        <span
          className={`
            text-xs px-2 py-1 rounded-full
            ${
              isToday
                ? 'bg-white text-blue-600'
                : 'bg-black text-white'
            }
          `}
        >
          {dayEvents.length}
        </span>
      ) : null}

    </div>

    <div className='space-y-2 max-h-28 overflow-y-auto pr-1'>

      {dayEvents.map((event) => (

        <button
          key={`${event.title}-${event.start.toISOString()}`}
          type='button'
          onClick={() => goToLead(event.leadId, event.type)}
          className={`
            w-full text-left rounded-xl px-3 py-2 text-xs shadow-sm hover:shadow transition border
            ${
              isToday
                ? 'bg-white text-black border-white'
                : 'bg-white border-gray-100'
            }
          `}
        >

          <div className='font-medium'>
            {event.title}
          </div>

          <div
            className={`mt-1 ${
              isToday
                ? 'text-gray-600'
                : 'text-gray-500'
            }`}
          >
            {moment(event.start).format('h:mm A')}
          </div>

        </button>

      ))}

    </div>

  </div>

)

          })}

        </div>

      </div>

    </div>

  )
}

export default CalendarPage