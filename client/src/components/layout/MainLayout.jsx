import Sidebar from './Sidebar'
import NotificationBell from '../common/NotificationBell'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      {/* Content Area */}
      <div className="ml-64 flex min-h-screen flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white shadow flex items-center justify-end px-6 sticky top-0 z-10">
          <NotificationBell />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout