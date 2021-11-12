
const fs = require('fs').promises
const readline = require('readline')
const { google } = require('googleapis')
const { asyncReadJSON } = require('./src/api-utils.js')
const { authorize } = require('./src/api-auth.js')

async function start(){
  const readCreds = await asyncReadJSON('credentials.json')
  const auth = await authorize(readCreds)
  const sheetsService = google.sheets({ version: 'v4', auth })

  const s = await createTODOTable(sheetsService)
  console.log(s)
  // await listMajors(auth)
}

start()

async function addMonth(service, sheetId) {
  const id = "sh1z9dA08oRyV4h83WWS-IvrlgYVGOCXQtdJusulGNouLk"

  const request = {
    spreadsheetId: s.data.spreadsheetId,
    resource: {
      requests: [
        {
          addSheet: {
            properties: {
              title: 'LIPIEC 2021',
              tabColor: {
                red: 1,
                green: 0,
                blue: 0,
                alpha: 1
              },
            }
          }
        }
      ],
    },
    auth: auth,
  }
}

async function createTODOTable(service) {
  const resource = {
    properties: {
      title: `yatodo_${Date.now()}`,
    },
  }
  try {
    const s = await service.spreadsheets.create({
      resource,
      fields: 'spreadsheetId',
    })
    return s
  } catch (err) {
    console.log(err)
  }
}


/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth})
  sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err)
    const rows = res.data.values
    if (rows.length) {
      console.log('Name, Major:')
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`)
      })
    } else {
      console.log('No data found.')
    }
  })
}
