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

const COLUMN_LABELS = {
  name: 'Client name',
  phone: 'Phone',
  city: 'City',
  email: 'Email',
  eventType: 'Event type',
  budget: 'Budget',
  weddingDate: 'Wedding date',
  notes: 'Notes',
}

const EXPECTED_FORMATS = {
  name: 'A non-empty text value',
  phone: 'A non-empty phone number',
  wedding_date: 'DD-MM-YYYY or YYYY-MM-DD',
}

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

const parseDate = (value) => {
  if (!value) return null;

  // Excel serial number
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);

    if (!date) return null;

    return new Date(date.y, date.m - 1, date.d);
  }

  const str = String(value).trim();

  // YYYY-MM-DD
  let match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // DD-MM-YYYY
  match = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);

  if (match) {
    const [, day, month, year] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // Reject everything else
  return null;
};

const buildRowError = ({
  row,
  column,
  value,
  message,
  expected,
}) => ({
  row,
  column,
  label: COLUMN_LABELS[column] || column,
  value: value === undefined || value === null ? '' : String(value),
  expected: expected || EXPECTED_FORMATS[column] || 'Valid value',
  message,
})

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
      const excelRow = index + 2

      const name = getValue(row, 'name')
      const phone = getValue(row, 'phone')

      if (!name) {
        errors.push(
          buildRowError({
            row: excelRow,
            column: 'name',
            value: name,
            message: 'Client name is required',
            expected: 'A non-empty text value, for example Rahul Sharma',
          })
        )

        return
      }

      if (!phone) {
        errors.push(
          buildRowError({
            row: excelRow,
            column: 'phone',
            value: phone,
            message: 'Phone number is required',
            expected: 'A non-empty phone number, for example 9876543210',
          })
        )

        return
      }

      const weddingDateValue = getValue(row, 'weddingDate')
      const followUpDateValue = getValue(row, 'followUpDate')

      const weddingDate = parseDate(weddingDateValue)
      const followUpDate = parseDate(followUpDateValue)

      if (weddingDateValue && !weddingDate) {
        errors.push(
          buildRowError({
            row: excelRow,
            column: 'wedding_date',
            value: weddingDateValue,
            message: 'Wedding date is invalid',
            expected: 'DD-MM-YYYY or YYYY-MM-DD, for example 10-12-2026',
          })
        )

        return
      }

      if (followUpDateValue && !followUpDate) {
        errors.push(
          buildRowError({
            row: excelRow,
            column: 'follow_up_date',
            value: followUpDateValue,
            message: 'Follow-up date is invalid',
            expected: 'DD-MM-YYYY or YYYY-MM-DD, for example 20-06-2026',
          })
        )

        return
      }

      leads.push({
        name: String(name).trim(),
        phone: String(phone).trim(),
        city: getValue(row, 'city'),
        email: getValue(row, 'email'),
        eventType: getValue(row, 'eventType'),
        budget: getValue(row, 'budget'),
        weddingDate,
        notes: getValue(row, 'notes'),
        status: 'NEW',
      })
    })

    // Save valid leads only
   // If any validation error exists, reject the entire import
if (errors.length > 0) {
  return res.status(400).json({
    success: false,
    message:
      'Import failed. Please fix the highlighted errors and upload the file again.',
    totalRows: data.length,
    imported: 0,
    failed: errors.length,
    errors,
  })
}

// Everything is valid, now save all rows
await Lead.insertMany(leads)

return res.status(200).json({
  success: true,
  message: 'All leads imported successfully.',
  totalRows: data.length,
  imported: leads.length,
  failed: 0,
  errors: [],
})
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}