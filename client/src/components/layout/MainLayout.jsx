import Sidebar from './Sidebar'

import NotificationBell from '../common/NotificationBell'

const MainLayout = ({ children }) => {

  return (

    <div className='flex min-h-screen bg-gray-100'>

      {/* SIDEBAR */}

      <Sidebar />

      {/* RIGHT SIDE */}

      <div className='flex-1 flex flex-col'>

        {/* TOPBAR */}

        <div className='h-16 bg-white shadow flex items-center justify-end px-6'>

          <NotificationBell />

        </div>

        {/* CONTENT */}

        <div className='flex-1'>

          {children}

        </div>

      </div>

    </div>

  )
}

export default MainLayout