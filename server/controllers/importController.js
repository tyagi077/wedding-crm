const XLSX = require('xlsx')

const Lead = require('../models/Lead')

exports.importLeads = async (req, res) => {

  try {

    // READ FILE

    const workbook = XLSX.readFile(
      req.file.path
    )

    const sheetName =
      workbook.SheetNames[0]

    const sheet =
      workbook.Sheets[sheetName]

    const data =
      XLSX.utils.sheet_to_json(sheet)

    // FORMAT DATA

    const leads = data.map((item) => ({

      name: item.name || '',

      phone: item.phone || '',

      city: item.city || '',

      status: 'NEW',

    }))

    // SAVE TO DB

    await Lead.insertMany(leads)

    res.json({

      message: 'Leads Imported',

      total: leads.length,

    })

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}