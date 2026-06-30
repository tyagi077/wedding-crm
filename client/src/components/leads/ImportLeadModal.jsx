import { useState } from 'react'
import * as XLSX from 'xlsx'
import api from '../../services/api'

const ImportLeadModal = ({
  closeModal,
  refreshLeads,
}) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    setFile(selectedFile)
    setResult(null)
  }

  const downloadSampleFile = () => {
    const sampleData = [
      {
        client_name: 'Rahul Sharma',
        phone: '9876543210',
        city: 'Delhi',
        email: 'rahul@gmail.com',
        event_type: 'Wedding',
        budget: '200000',
        wedding_date: '2026-12-10',
        follow_up_date: '2026-06-20',
        notes: 'Interested in premium package',
      },
    ]

    const worksheet =
      XLSX.utils.json_to_sheet(sampleData)

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Leads'
    )

    XLSX.writeFile(
      workbook,
      'Lead_Import_Sample.xlsx'
    )
  }

  const handleImport = async () => {
    if (!file) return

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('file', file)

      const { data } = await api.post(
        '/import/data',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      )

      setResult(data)

      if (data.success) {
        refreshLeads()
      }
    }catch (error) {
  setResult({
    success: false,
    message:
      error.response?.data?.message ||
      'Import failed',

    missingColumns:
      error.response?.data?.missingColumns ||
      [],

    errors:
      error.response?.data?.errors || [],

    imported:
      error.response?.data?.imported || 0,

    failed:
      error.response?.data?.failed || 0,

    totalRows:
      error.response?.data?.totalRows || 0,
  })
} finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // close when clicking on backdrop
        if (e.target === e.currentTarget) {
          closeModal && closeModal()
        }
      }}
    >

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold">
              Import Leads
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Upload an Excel file to
              import leads into your CRM
            </p>
          </div>

          <button
            type="button"
            onClick={() => closeModal && closeModal()}
            aria-label="Close import modal"
            className="h-10 w-10 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}

        <div className="p-6">

          {!result?.success && (
            <>
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center">

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  id="excel-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="excel-upload"
                  className="cursor-pointer block"
                >
                  <div className="text-6xl mb-4">
                    📊
                  </div>

                  <h3 className="text-lg font-semibold">
                    Upload Excel File
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Click here to browse
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Supported formats:
                    .xlsx, .xls
                  </p>
                </label>

                {file && (
                  <div className="mt-5 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                    <span>📄</span>
                    <span className="font-medium">
                      {file.name}
                    </span>
                  </div>
                )}
              </div>

              {result && !result.success && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">

                  <p className="font-medium text-red-700">
                    {result.message}
                  </p>

                  {result.missingColumns
                    ?.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-red-600">
                        Missing Columns:
                      </p>

                      <ul className="list-disc ml-5 mt-2 text-sm">
                        {result.missingColumns.map(
                          (column) => (
                            <li key={column}>
                              {column}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <pre className="bg-black text-white p-4 rounded">
  {JSON.stringify(result, null, 2)}
</pre>

              {result?.errors?.length > 0 && (

  <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">

    <h3 className="font-semibold text-yellow-700">
      Import Summary
    </h3>

    <div className="grid grid-cols-3 gap-4 mt-4">

      <div className="bg-white rounded-xl p-3 text-center">
        <p className="text-gray-500 text-sm">
          Total
        </p>

        <p className="text-2xl font-bold">
          {result.totalRows}
        </p>
      </div>

      <div className="bg-green-50 rounded-xl p-3 text-center">
        <p className="text-green-600 text-sm">
          Imported
        </p>

        <p className="text-2xl font-bold text-green-600">
          {result.imported}
        </p>
      </div>

      <div className="bg-red-50 rounded-xl p-3 text-center">
        <p className="text-red-600 text-sm">
          Failed
        </p>

        <p className="text-2xl font-bold text-red-600">
          {result.failed}
        </p>
      </div>

    </div>

  </div>

)}

              {result?.errors?.length > 0 && (
  <div className="mt-6">

    <h4 className="font-semibold text-red-600 mb-3">
      Import Errors
    </h4>

    <div className="max-h-72 overflow-y-auto border rounded-2xl">

      <table className="w-full text-sm">

        <thead className="bg-gray-100 sticky top-0">

          <tr>

            <th className="text-left p-3">
              Row
            </th>

            <th className="text-left p-3">
              Column
            </th>

            <th className="text-left p-3">
              Invalid Value
            </th>

            <th className="text-left p-3">
              Reason
            </th>

          </tr>

        </thead>

        <tbody>

          {result.errors.map((error, index) => (

            <tr
              key={index}
              className="border-t"
            >

              <td className="p-3 font-medium">
                {error.row}
              </td>

              <td className="p-3 text-red-600">
                {error.column}
              </td>

              <td className="p-3">

                {error.value || '-'}

              </td>

              <td className="p-3">

                {error.message}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>
)}
            </>
          )}

          {/* Success State */}

          {result?.success && (
            <div>

              <div className="text-center mb-6">
                <div className="text-6xl">
                  ✅
                </div>

                <h3 className="text-2xl font-bold mt-4">
                  Import Completed
                </h3>

                <p className="text-gray-500 mt-2">
                  Your leads have been
                  processed successfully.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">

                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-gray-500 text-sm">
                    Total Rows
                  </p>

                  <p className="text-3xl font-bold">
                    {result.totalRows}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-2xl text-center">
                  <p className="text-green-600 text-sm">
                    Imported
                  </p>

                  <p className="text-3xl font-bold text-green-600">
                    {result.imported}
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-2xl text-center">
                  <p className="text-red-600 text-sm">
                    Failed
                  </p>

                  <p className="text-3xl font-bold text-red-600">
                    {result.failed}
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}

        {!result?.success ? (
          <div className="flex items-center justify-between px-6 py-5 border-t">

            <button
              type="button"
              onClick={downloadSampleFile}
              className="text-green-600 font-medium hover:text-green-700"
            >
              Download Sample File
            </button>

            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Importing...'
                : 'Import Leads'}
            </button>

          </div>
        ) : (
          <div className="flex justify-end px-6 py-5 border-t">

            <button
              onClick={closeModal}
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              Done
            </button>

          </div>
        )}

      </div>

    </div>
  )
}

export default ImportLeadModal