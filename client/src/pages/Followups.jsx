import { useEffect, useState } from 'react'

import api from '../services/api'

const Followups = () => {

  const [followups, setFollowups] = useState([])

  const [loading, setLoading] = useState(true)

  const fetchFollowups = async () => {

    try {

      const response = await api.get(
        '/followups/today'
      )

      setFollowups(response.data)

      setLoading(false)

    } catch (error) {

      console.log(error)

      setLoading(false)

    }

  }

  useEffect(() => {

    fetchFollowups()

  }, [])

  return (

    <div className='p-6'>

      {/* HEADER */}

      <div className='mb-8'>

        <h1 className='text-4xl font-bold'>
          Today's Followups
        </h1>

        <p className='text-gray-500 mt-2'>
          Manage pending client calls
        </p>

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
              No Followups Today 🎉
            </h2>

          </div>
        )
      }

      {/* FOLLOWUP LIST */}

      <div className='space-y-5'>

        {
          followups.map((item) => (

            <div
              key={item._id}
              className='bg-white rounded-3xl shadow p-6'
            >

              <div className='flex items-center justify-between'>

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
                    {
                      new Date(
                        item.followupDate
                      ).toLocaleString()
                    }
                  </p>

                </div>

              </div>

              {/* NOTE */}

              <div className='mt-5 bg-gray-100 p-4 rounded-2xl'>

                <p className='text-gray-700'>
                  {item.note}
                </p>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )
}

export default Followups