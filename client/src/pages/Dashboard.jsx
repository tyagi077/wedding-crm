import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../services/api'

const Dashboard = () => {

  const [stats, setStats] = useState(null)

  const fetchStats = async () => {

    try {

      const response = await api.get(
        '/leads/stats/dashboard'
      )

      setStats(response.data)

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    fetchStats()

  }, [])

  if (!stats) {
    return <h1 className='p-6'>Loading...</h1>
  }

  return (

    <div className='p-6'>

      {/* HEADER */}

      <div className='mb-8'>

        <h1 className='text-4xl font-bold'>
          Dashboard
        </h1>

        <p className='text-gray-500 mt-2'>
          Wedding CRM Overview
        </p>

      </div>

      {/* STATS */}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>

        {/* TOTAL */}

        <div className='bg-white rounded-3xl shadow p-6'>

          <p className='text-gray-500'>
            Total Leads
          </p>

          <h2 className='text-4xl font-bold mt-3'>
            {stats.totalLeads}
          </h2>

        </div>

        {/* HOT */}

        <div className='bg-white rounded-3xl shadow p-6'>

          <p className='text-gray-500'>
            Hot Leads
          </p>

          <h2 className='text-4xl font-bold text-red-500 mt-3'>
            {stats.hotLeads}
          </h2>

        </div>

        {/* FOLLOWUPS */}

        <div className='bg-white rounded-3xl shadow p-6'>

          <p className='text-gray-500'>
            Followups
          </p>

          <h2 className='text-4xl font-bold text-orange-500 mt-3'>
            {stats.followups}
          </h2>

        </div>

        {/* BOOKINGS */}

        <div className='bg-white rounded-3xl shadow p-6'>

          <p className='text-gray-500'>
            Booked Weddings
          </p>

          <h2 className='text-4xl font-bold text-green-500 mt-3'>
            {stats.bookedLeads}
          </h2>

        </div>

      </div>

      {/* RECENT SECTION */}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>

        {/* RECENT ACTIVITY */}

        <div className='bg-white rounded-3xl shadow p-6'>

          <h2 className='text-2xl font-bold mb-5'>
            Recent Activity
          </h2>

          <div className='space-y-4'>

            <div className='border-l-4 border-black pl-4'>

              <p className='font-medium'>
                New Lead Added
              </p>

              <p className='text-gray-500 text-sm'>
                2 minutes ago
              </p>

            </div>

            <div className='border-l-4 border-orange-500 pl-4'>

              <p className='font-medium'>
                Followup Scheduled
              </p>

              <p className='text-gray-500 text-sm'>
                10 minutes ago
              </p>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className='bg-white rounded-3xl shadow p-6'>

          <h2 className='text-2xl font-bold mb-5'>
            Quick Actions
          </h2>

          <div className='grid grid-cols-2 gap-4'>

            <Link
              to='/leads?add=1'
              className='block w-full bg-black text-white py-4 rounded-2xl text-center'
            >
              Add Lead
            </Link>

            <Link
              to='/followups'
              className='block w-full bg-orange-500 text-white py-4 rounded-2xl text-center'
            >
              Followups
            </Link>

            <Link
              to='/calendar'
              className='block w-full bg-green-500 text-white py-4 rounded-2xl text-center'
            >
              Bookings
            </Link>

            <Link
              to='/analytics'
              className='block w-full bg-blue-500 text-white py-4 rounded-2xl text-center'
            >
              Analytics
            </Link>

          </div>

        </div>

      </div>

    </div>

  )
}

export default Dashboard