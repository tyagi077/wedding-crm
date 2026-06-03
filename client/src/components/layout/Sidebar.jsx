import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-black text-white p-5">
      <h1 className="text-2xl font-bold mb-10">
        Wedding CRM
      </h1>

      <div className="flex flex-col gap-4">
        <Link
          to="/dashboard"
          className="px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
        >
          Dashboard
        </Link>

        <Link
          to="/leads"
          className="px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
        >
          Leads
        </Link>

        <Link
          to="/followups"
          className="px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
        >
          Followups
        </Link>

        <Link
          to="/pipeline"
          className="px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
        >
          Pipeline
        </Link>

        <Link
          to="/calendar"
          className="px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
        >
          Calendar
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar