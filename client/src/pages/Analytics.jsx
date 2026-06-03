import { useEffect, useState } from 'react'

import api from '../services/api'

const Analytics = () => {

	const [stats, setStats] = useState(null)

	const fetchStats = async () => {

		try {

			const response = await api.get('/leads/stats/dashboard')

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

			<div className='mb-8'>

				<h1 className='text-4xl font-bold'>
					Analytics
				</h1>

				<p className='text-gray-500 mt-2'>
					Snapshot of the pipeline and bookings
				</p>

			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>

				<div className='bg-white rounded-3xl shadow p-6'>
					<p className='text-gray-500'>Total Leads</p>
					<h2 className='text-4xl font-bold mt-3'>{stats.totalLeads}</h2>
				</div>

				<div className='bg-white rounded-3xl shadow p-6'>
					<p className='text-gray-500'>Hot Leads</p>
					<h2 className='text-4xl font-bold text-red-500 mt-3'>{stats.hotLeads}</h2>
				</div>

				<div className='bg-white rounded-3xl shadow p-6'>
					<p className='text-gray-500'>Followups</p>
					<h2 className='text-4xl font-bold text-orange-500 mt-3'>{stats.followups}</h2>
				</div>

				<div className='bg-white rounded-3xl shadow p-6'>
					<p className='text-gray-500'>Booked Weddings</p>
					<h2 className='text-4xl font-bold text-green-500 mt-3'>{stats.bookedLeads}</h2>
				</div>

			</div>

		</div>

	)

}

export default Analytics
