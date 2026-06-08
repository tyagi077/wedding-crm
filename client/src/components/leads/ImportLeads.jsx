import { useState } from 'react'
import * as XLSX from 'xlsx'
import api from '../../services/api'

const ImportLeads = ({
  closeModal,
  refreshLeads,
}) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]

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
    if (!file) {
      alert('Please select an Excel file')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('file', file)

      const { data } = await api.post(
        '/import/',
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
        refreshLeads?.()
      }
    } catch (error) {
      setResult({
        success: false,
        message:
          error.response?.data?.message ||
          'Import failed',
        missingColumns:
          error.response?.data
            ?.missingColumns || [],
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold">
              Import Leads
            </h2>

            <p className="text-sm text-gray-500">
              Upload an Excel file to import leads.
            </p>
          </div>

          <button
            type="button"
            onClick={() => closeModal && closeModal()}
            className="h-10 w-10 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}

        <div className="p-6">

          <input
            type="file"
            accept=".xlsx,.xls"
            id="excel-upload"
            className="hidden"
            onChange={handleFileChange}
          />

          {!file ? (
            <label
              htmlFor="excel-upload"
              className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center cursor-pointer block hover:border-black transition"
            >
              <div className="text-5xl mb-3">
                📊
              </div>

              <h3 className="font-semibold text-lg">
                Select Excel File
              </h3>

              <p className="text-gray-500 mt-2">
                Click here to browse
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Supported formats:
                .xlsx, .xls
              </p>
            </label>
          ) : (
            <div className="border rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">

                <div className="text-3xl">
                  📄
                </div>

                <div>
                  <p className="font-medium">
                    {file.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

              </div>

              <label
                htmlFor="excel-upload"
                className="text-sm text-blue-600 cursor-pointer hover:underline"
              >
                Change
              </label>
            </div>
          )}

          {/* Error State */}

          {result && !result.success && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">

              <p className="font-medium text-red-700">
                {result.message}
              </p>

              {result.missingColumns?.length >
                0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-red-600">
                    Missing Columns:
                  </p>

                  <ul className="mt-2 list-disc ml-5 text-sm text-red-600">
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

          {/* Success State */}

          {result?.success && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-5">

              <div className="text-center">
                <div className="text-5xl">
                  ✅
                </div>

                <h3 className="font-semibold text-green-700 mt-2">
                  Import Completed
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-2xl font-bold">
                    {result.totalRows}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-green-600">
                    Imported
                  </p>

                  <p className="text-2xl font-bold text-green-600">
                    {result.imported}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-red-600">
                    Failed
                  </p>

                  <p className="text-2xl font-bold text-red-600">
                    {result.failed}
                  </p>
                </div>

              </div>

              {result.errors?.length > 0 && (
                <div className="mt-6">

                  <h4 className="font-medium mb-2">
                    Failed Rows
                  </h4>

                  <div className="max-h-40 overflow-y-auto border rounded-xl bg-white">

                    {result.errors.map(
                      (error, index) => (
                        <div
                          key={index}
                          className="p-3 border-b last:border-b-0 text-sm"
                        >
                          Row {error.row} —{' '}
                          {error.error}
                        </div>
                      )
                    )}

                  </div>

                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}

        <div className="flex items-center justify-between px-6 py-5 border-t">

          {!result?.success ? (
            <>
              <button
                type="button"
                onClick={downloadSampleFile}
                className="text-green-600 font-medium hover:text-green-700"
              >
                Download Sample
              </button>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => closeModal && closeModal()}
                  className="px-5 py-3 border rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleImport}
                  disabled={!file || loading}
                  className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
                >
                  {loading
                    ? 'Importing...'
                    : 'Import Leads'}
                </button>

              </div>
            </>
          ) : (
            <div className="w-full flex justify-end">

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
    </div>
  )
}

export default ImportLeads