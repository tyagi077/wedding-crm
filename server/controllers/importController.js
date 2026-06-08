const XLSX = require('xlsx')
const Lead = require('../models/Lead')

const COLUMN_MAPPING = {
  name: [
    'name',
    'client_name',
    'client name',
    'customer_name',
    'customer name',
  ],

  phone: [
    'phone',
    'mobile',
    'mobile_number',
    'phone_number',
    'phone number',
    'contact',
  ],

  city: [
    'city',
    'location',
  ],

  email: [
    'email',
    'email_address',
    'email address',
  ],

  eventType: [
    'eventtype',
    'event_type',
    'event type',
    'occasion',
  ],

  budget: [
    'budget',
    'estimated_budget',
    'estimated budget',
  ],

  weddingDate: [
    'weddingdate',
    'wedding_date',
    'event_date',
    'event date',
  ],

  followUpDate: [
    'followupdate',
    'follow_up_date',
    'follow up date',
    'next_followup',
  ],

  notes: [
    'notes',
    'remark',
    'remarks',
    'comment',
  ],
}

const REQUIRED_COLUMNS = [
  'name',
  'phone',
]

const normalize = (str) =>
  String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')

const getValue = (row, field) => {
  const rowKeys = Object.keys(row)

  const matchedKey = rowKeys.find((key) =>
    COLUMN_MAPPING[field].includes(normalize(key))
  )

  return matchedKey ? row[matchedKey] : ''
}

exports.importLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Excel file is required',
      })
    }

    // Read Excel
    const workbook = XLSX.readFile(req.file.path)

    const sheetName = workbook.SheetNames[0]

    const sheet = workbook.Sheets[sheetName]

    const data = XLSX.utils.sheet_to_json(sheet)

    if (!data.length) {
      return res.status(400).json({
        message: 'Excel file is empty',
      })
    }

    // Validate required columns
    const excelHeaders = Object.keys(data[0]).map(normalize)

    const missingColumns = REQUIRED_COLUMNS.filter(
      (requiredField) =>
        !COLUMN_MAPPING[requiredField].some((alias) =>
          excelHeaders.includes(normalize(alias))
        )
    )

    if (missingColumns.length) {
      return res.status(400).json({
        message: 'Required columns are missing',
        missingColumns,
      })
    }

    const leads = []
    const errors = []

    data.forEach((row, index) => {
      const name = getValue(row, 'name')
      const phone = getValue(row, 'phone')

      // Row validation
      if (!name || !phone) {
        errors.push({
          row: index + 2, // Excel row number
          error: 'Name or Phone is missing',
        })

        return
      }

      leads.push({
        name: String(name).trim(),

        phone: String(phone).trim(),

        city: getValue(row, 'city'),

        email: getValue(row, 'email'),

        eventType: getValue(row, 'eventType'),

        budget: getValue(row, 'budget'),

        weddingDate: getValue(row, 'weddingDate')
          ? new Date(getValue(row, 'weddingDate'))
          : null,

        followUpDate: getValue(row, 'followUpDate')
          ? new Date(getValue(row, 'followUpDate'))
          : null,

        notes: getValue(row, 'notes'),

        status: 'NEW',
      })
    })

    // Save valid leads only
    if (leads.length) {
      await Lead.insertMany(leads)
    }

    return res.status(200).json({
      success: true,

      message: 'Import completed',

      totalRows: data.length,

      imported: leads.length,

      failed: errors.length,

      errors,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}