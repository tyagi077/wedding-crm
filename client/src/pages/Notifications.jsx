import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import api from '../services/api'

const Notifications = () => {

  const [notifications, setNotifications] =
    useState([])

  const fetchNotifications = async () => {

    try {

      const response = await api.get(
        '/notifications'
      )

      setNotifications(response.data)

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    fetchNotifications()

  }, [])

  return (

    <div className='p-6'>

      {/* HEADER */}

      <div className='mb-8'>

        <h1 className='text-4xl font-bold'>
          Notifications
        </h1>

        <p className='text-gray-500 mt-2'>
          Followups & reminders
        </p>

      </div>

      {/* LIST */}

      <div className='space-y-4'>

        {
          notifications.map((item) => (

            <Link
              to={`/leads/${item.leadId?._id}`}
              key={item._id}
            >

              <div className='bg-white rounded-3xl shadow p-5 hover:bg-gray-50 transition'>

                <div className='flex justify-between'>

                  <div>

                    <p className='font-medium'>
                      {item.message}
                    </p>

                    <p className='text-gray-500 mt-1'>
                      {item.leadId?.name}
                    </p>

                  </div>

                  <p className='text-sm text-gray-400'>

                    {
                      new Date(
                        item.createdAt
                      ).toLocaleString()
                    }

                  </p>

                </div>

              </div>

            </Link>

          ))
        }

      </div>

    </div>

  )
}

export default Notifications