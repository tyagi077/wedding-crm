import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import LeadDetails from './pages/LeadDetails'
import LeadConversation from './pages/LeadConversation'
import MainLayout from './components/layout/MainLayout'
import Followups from './pages/Followups'
import Pipeline from './pages/Pipeline'
import CalendarPage from './pages/Calendar'
import Notifications from './pages/Notifications'
import Analytics from './pages/Analytics'
function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path='/'
          element={<Navigate to='/dashboard' />}
        />

        <Route
          path='/dashboard'
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path='/leads'
          element={
            <MainLayout>
              <Leads />
            </MainLayout>
          }
        />
        <Route
          path='/leads/:id'
          element={
            <MainLayout>
              <LeadDetails />
            </MainLayout>
          }
        />

        <Route
          path='/followups/:leadId'
          element={
            <MainLayout>
              <LeadConversation />
            </MainLayout>
          }
        />

        <Route
        path='/followups'
        element={
          <MainLayout>
            <Followups />
          </MainLayout>
        }
      />
      <Route
      path='/pipeline'
      element={
        <MainLayout>
          <Pipeline />
        </MainLayout>
      }
    />
      <Route
        path='/analytics'
        element={
          <MainLayout>
            <Analytics />
          </MainLayout>
        }
      />
    <Route
  path='/calendar'
  element={
    <MainLayout>
      <CalendarPage />
    </MainLayout>
  }
/>
<Route
  path='/notifications'
  element={
    <MainLayout>
      <Notifications />
    </MainLayout>
  }
/>

      </Routes>

    </BrowserRouter>
  )
}

export default App