import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLeads } from '../redux/slices/leadSlice'
import { useState } from 'react'
import AddLeadModal from '../components/leads/AddLeadModal'
import { Link, useLocation } from 'react-router-dom'
import ImportLeads from '../components/leads/ImportLeads'

const statusLabels = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  INTERESTED: 'Interested',
  FOLLOW_UP: 'Follow Up',
  BOOKED: 'Booked',
  LOST: 'Lost',
}

const Leads = () => {

  const [showModal, setShowModal] = useState(false)

  const [search, setSearch] = useState('')

const [statusFilter, setStatusFilter] =
  useState('ALL')

const [cityFilter, setCityFilter] =
  useState('ALL')

  const location = useLocation()

  const dispatch = useDispatch()

  const { leads, loading } = useSelector(
    (state) => state.leads
  )

  const filteredLeads = leads.filter((lead) => {

  const matchesSearch =

    lead.name
      .toLowerCase()
      .includes(search.toLowerCase())

  const matchesStatus =

    statusFilter === 'ALL'
      ? true
      : lead.status === statusFilter

  const matchesCity =

    cityFilter === 'ALL'
      ? true
      : lead.city === cityFilter

  return (
    matchesSearch &&
    matchesStatus &&
    matchesCity
  )

})


  useEffect(() => {
    dispatch(fetchLeads())
  }, [dispatch])

  useEffect(() => {
    const params = new URLSearchParams(location.search)

    if (params.get('add') === '1') {
      setShowModal(true)
    }
  }, [location.search])

  return (
    <div className='p-6'>

      {/* TOPBAR */}

      <div className='flex items-center justify-between mb-8'>

        <div>
          <h1 className='text-4xl font-bold'>
            Leads
          </h1>

          <p className='text-gray-500 mt-1'>
            Manage all wedding clients
          </p>
        </div>

        <button
        onClick={() => setShowModal(true)}
        className='bg-black text-white px-6 py-4 rounded-2xl font-medium hover:scale-105 transition'
        >
        Add Lead
        </button>
        <ImportLeads
  refreshLeads={() =>
    dispatch(fetchLeads())
  }
/>

      </div>
      

      {/* STATS */}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>

        <div className='bg-white p-5 rounded-2xl shadow'>
          <p className='text-gray-500'>
            Total Leads
          </p>

          <h2 className='text-3xl font-bold mt-2'>
            {leads.length}
          </h2>
        </div>

        <div className='bg-white p-5 rounded-2xl shadow'>
          <p className='text-gray-500'>
            Hot Leads
          </p>

          <h2 className='text-3xl font-bold text-red-500 mt-2'>
            {leads.filter((lead) => lead.status === 'INTERESTED').length}
          </h2>
        </div>

        <div className='bg-white p-5 rounded-2xl shadow'>
          <p className='text-gray-500'>
            Today's Followups
          </p>

          <h2 className='text-3xl font-bold text-orange-500 mt-2'>
            5
          </h2>
        </div>

      </div>

      {/* SEARCH */}

     {/* FILTERS */}

<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>

  {/* SEARCH */}

  <input
    type='text'
    placeholder='Search leads...'
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className='bg-white p-4 rounded-2xl shadow outline-none'
  />

  {/* STATUS */}

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    className='bg-white p-4 rounded-2xl shadow outline-none'
  >

    <option value='ALL'>
      All Status
    </option>

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

  {/* CITY */}

  <select
    value={cityFilter}
    onChange={(e) =>
      setCityFilter(e.target.value)
    }
    className='bg-white p-4 rounded-2xl shadow outline-none'
  >

    <option value='ALL'>
      All Cities
    </option>

    {
      [
        ...new Set(
          leads.map((lead) => lead.city)
        ),
      ].map((city) => (

        <option
          key={city}
          value={city}
        >

          {city}

        </option>

      ))
    }

  </select>

</div>

      {/* LEADS TABLE */}

      <div className='bg-white rounded-2xl shadow overflow-hidden'>

        <table className='w-full'>

          <thead className='bg-gray-100'>

            <tr>

              <th className='text-left p-4'>
                Client
              </th>

              <th className='text-left p-4'>
                Phone
              </th>

              <th className='text-left p-4'>
                City
              </th>

              <th className='text-left p-4'>
                Email
              </th>

              <th className='text-left p-4'>
                Details
              </th>

              <th className='text-left p-4'>
                Status
              </th>

            </tr>

          </thead>

         <tbody>

  {
   filteredLeads.map((lead) => (

      <tr
        key={lead._id}
        onClick={() => window.location.href = `/leads/${lead._id}`}
        className='border-t hover:bg-gray-50 transition cursor-pointer'
      >

        <td className='p-4 font-medium'>
          {lead.name}
        </td>

        <td className='p-4'>
          {lead.phone}
        </td>

        <td className='p-4'>
          {lead.city}
        </td>

        <td className='p-4 text-sm text-gray-600'>
          {lead.email || 'Not added'}
        </td>

        <td className='p-4 text-sm text-gray-600'>
          <div className='space-y-1'>

            <p>
              {lead.eventType || 'Not added'}
            </p>

            <p>
              Budget: {lead.budget || 'Not added'}
            </p>

          </div>
        </td>

        <td className='p-4'>

          <span className='bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm'>
            {statusLabels[lead.status] || lead.status}
          </span>

        </td>

      </tr>

    ))
  }

</tbody>

        </table>

      </div>

      {
        loading && (
          <p className='mt-4'>
            Loading...
          </p>
        )
      }
      {
        showModal && (
            <AddLeadModal
            closeModal={() => setShowModal(false)}
            refreshLeads={() => dispatch(fetchLeads())}
            />
        )
      }


    </div>
  )
}


export default Leads