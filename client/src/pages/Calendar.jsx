import { useEffect, useState } from 'react'

import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar'

import moment from 'moment'

import 'react-big-calendar/lib/css/react-big-calendar.css'

import api from '../services/api'

const localizer = momentLocalizer(moment)

const CalendarPage = () => {

  const [events, setEvents] = useState([])

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

          }))

      // FOLLOWUP EVENTS

      const followupEvents =
        followupResponse.data.map((item) => ({

          title:
         `${item.leadId?.name} Followup`,

          start: new Date(item.followupDate),

          end: new Date(item.followupDate),

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

      {/* CALENDAR */}

      <div className='bg-white rounded-3xl shadow p-6 h-[80vh]'>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{
            height: '100%',
          }}
        />

      </div>

    </div>

  )
}

export default CalendarPage