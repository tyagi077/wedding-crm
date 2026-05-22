import { useState } from 'react'

import api from '../../services/api'

const ImportLeads = ({ refreshLeads }) => {

  const [file, setFile] = useState(null)

  const [loading, setLoading] =
    useState(false)

  const handleImport = async () => {

    if (!file) return

    try {

      setLoading(true)

      const formData = new FormData()

      formData.append('file', file)

      const response = await api.post(
        '/import',
        formData
      )

      alert(
        `${response.data.total} Leads Imported`
      )

      refreshLeads()

      setLoading(false)

    } catch (error) {

      console.log(error)

      setLoading(false)

    }

  }

  return (

    <div className='flex items-center gap-3'>

      <input
        type='file'
        accept='.xlsx,.xls'
        onChange={(e) =>
          setFile(e.target.files[0])
        }
        className='border p-3 rounded-xl bg-white'
      />

      <button
        onClick={handleImport}
        className='bg-green-500 text-white px-5 py-3 rounded-xl'
      >

        {
          loading
            ? 'Importing...'
            : 'Import Leads'
        }

      </button>

    </div>

  )
}

export default ImportLeads