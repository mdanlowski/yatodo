const fs = require('fs').promises
const { google } = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
// The file token.json stores the user's access and refresh tokens, and is created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = 'token.json'

// Load client secrets from a local file.
async function authorize(credentials){
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0])

  try {
    const token = await fs.readFile(TOKEN_PATH)
    oAuth2Client.setCredentials(JSON.parse(token))
  } catch (err) {
    const newToken = await getNewToken(oAuth2Client)
    oAuth2Client.setCredentials(newToken)
  }
  return oAuth2Client
}


async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      return token
    })
  })
}

module.exports = { authorize, getNewToken }

