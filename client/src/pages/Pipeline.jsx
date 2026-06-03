import { useEffect, useState } from 'react'

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

const Pipeline = () => {

  const [leads, setLeads] = useState([])

  const fetchLeads = async () => {

    try {

      const response = await api.get('/leads')

      setLeads(response.data)

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    fetchLeads()

  }, [])

  const updateStatus = async (leadId, status) => {

    try {

      await api.put(`/leads/${leadId}`, {
        status,
      })

      fetchLeads()

    } catch (error) {

      console.log(error)

    }

  }

  const formatDate = (value) => {

    if (!value) {
      return 'No date set'
    }

    return new Date(value).toLocaleDateString()

  }

  return (

    <div className='p-6 min-w-0 overflow-x-auto'>

      {/* HEADER */}

      <div className='mb-8'>

        <h1 className='text-4xl font-bold'>
          Sales Pipeline
        </h1>

        <p className='text-gray-500 mt-2'>
          Track wedding clients visually
        </p>

      </div>

      {/* BOARD */}

      <div className='flex gap-6 w-max min-w-full'>

        {
          statuses.map((status) => (

            <div
              key={status}
              className='w-[320px] bg-gray-100 rounded-3xl p-4 shrink-0'
            >

              {/* COLUMN HEADER */}

              <div className='flex items-center justify-between mb-5'>

                <h2 className='text-xl font-bold'>
                  {statusLabels[status] || status}
                </h2>

                <span className='bg-black text-white text-sm px-3 py-1 rounded-full'>

                  {
                    leads.filter(
                      (lead) => lead.status === status
                    ).length
                  }

                </span>

              </div>

              {/* CARDS */}

              <div className='space-y-4'>

                {
                  leads
                    .filter(
                      (lead) => lead.status === status
                    )
                    .map((lead) => (

                      <div
                        key={lead._id}
                        className='bg-white rounded-2xl shadow p-4'
                      >

                        <h3 className='text-lg font-semibold'>
                          {lead.name}
                        </h3>

                        <p className='text-gray-500 mt-1'>
                          {lead.phone}
                        </p>

                        <p className='text-gray-500'>
                          {lead.city}
                        </p>

                        <div className='mt-3 space-y-1 text-sm text-gray-600'>

                          {lead.email ? (
                            <p>{lead.email}</p>
                          ) : null}

                          {lead.eventType ? (
                            <p>{lead.eventType}</p>
                          ) : null}

                          {lead.budget ? (
                            <p>Budget: {lead.budget}</p>
                          ) : null}

                          <p>
                            Wedding: {formatDate(lead.weddingDate)}
                          </p>

                          <p>
                            Follow-up: {formatDate(lead.followUpDate)}
                          </p>

                        </div>

                        {/* ACTIONS */}

                        <div className='mt-4 flex flex-wrap gap-2'>

                          {
                            statuses
                              .filter((s) => s !== status)
                              .map((nextStatus) => (

                                <button
                                  key={nextStatus}
                                  onClick={() =>
                                    updateStatus(
                                      lead._id,
                                      nextStatus
                                    )
                                  }
                                  className='text-xs bg-black text-white px-3 py-2 rounded-xl'
                                >

                                  {statusLabels[nextStatus] || nextStatus}

                                </button>

                              ))
                          }

                        </div>

                      </div>

                    ))
                }

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )
}

export default Pipeline