import { useState } from 'react'
import api from '../../services/api'

const AddLeadModal = ({ closeModal, refreshLeads }) => {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    email: '',
    eventType: '',
    budget: '',
    weddingDate: '',
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
      setLoading(true)

      await api.post('/leads', formData)

      refreshLeads()
      closeModal()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Lead
            </h2>
            <p className="text-sm text-gray-500">
              Enter client details below
            </p>
          </div>

          <button
            onClick={closeModal}
            className="h-10 w-10 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[75vh]"
        >
          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Client Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter client name"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="9876543210"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="Delhi"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="client@email.com"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Event Type
              </label>
              <input
                type="text"
                name="eventType"
                placeholder="Wedding, Reception..."
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Budget
              </label>
              <input
                type="text"
                name="budget"
                placeholder="₹ 1,00,000"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Event Date
              </label>
              <input
                type="date"
                name="weddingDate"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                onChange={handleChange}
              />
            </div>
          
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Notes
            </label>
            <textarea
              name="notes"
              rows="4"
              placeholder="Add lead notes..."
              className="w-full border border-gray-300 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLeadModal