import { useState } from 'react'
import api from '../../services/api'

const AddLeadModal = ({ closeModal, refreshLeads }) => {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    email: '',
    eventType: '',
    budget: '',
    weddingDate: '',
    followUpDate: '',
    notes: '',
    status: 'NEW',
  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await api.post('/leads', formData)

      refreshLeads()

      closeModal()

    } catch (error) {

      console.log(error)

    }

  }

  return (

    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>

      <div className='bg-white p-6 rounded-3xl w-[450px]'>

        <div className='flex items-center justify-between mb-6'>

          <h1 className='text-2xl font-bold'>
            Add New Lead
          </h1>

          <button
            onClick={closeModal}
            className='text-xl'
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >

          <input
            type='text'
            name='name'
            placeholder='Client Name'
            className='w-full border p-4 rounded-2xl'
            onChange={handleChange}
          />

          <input
            type='text'
            name='phone'
            placeholder='Phone Number'
            className='w-full border p-4 rounded-2xl'
            onChange={handleChange}
          />

          <input
            type='text'
            name='city'
            placeholder='City'
            className='w-full border p-4 rounded-2xl'
            onChange={handleChange}
          />

          <input
            type='email'
            name='email'
            placeholder='Email Address'
            className='w-full border p-4 rounded-2xl'
            onChange={handleChange}
          />

          <input
            type='text'
            name='eventType'
            placeholder='Event Type (Wedding, Reception, Engagement, etc.)'
            className='w-full border p-4 rounded-2xl'
            onChange={handleChange}
          />

          <input
            type='text'
            name='budget'
            placeholder='Budget'
            className='w-full border p-4 rounded-2xl'
            onChange={handleChange}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

            <input
              type='date'
              name='weddingDate'
              className='w-full border p-4 rounded-2xl'
              onChange={handleChange}
            />

            <input
              type='date'
              name='followUpDate'
              className='w-full border p-4 rounded-2xl'
              onChange={handleChange}
            />

          </div>

          <textarea
            name='notes'
            placeholder='Notes'
            rows='4'
            className='w-full border p-4 rounded-2xl'
            onChange={handleChange}
          />

          <button className='w-full bg-black text-white py-4 rounded-2xl'>
            Save Lead
          </button>

        </form>

      </div>

    </div>

  )
}

export default AddLeadModal