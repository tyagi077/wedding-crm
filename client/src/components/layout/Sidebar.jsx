import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='w-64 h-screen bg-black text-white p-5'>

      <h1 className='text-2xl font-bold mb-10'>
        Wedding CRM
      </h1>

      <div className='flex flex-col gap-4'>

        <Link to='/dashboard'>
          Dashboard
        </Link>

        <Link to='/leads'>
          Leads
        </Link>

        <Link to='/followups'>
        Followups
      </Link>

      <Link to='/pipeline'>
        Pipeline
      </Link>

      <Link to='/calendar'>
      Calendar
    </Link>

      </div>

    </div>
  )
}

export default Sidebar