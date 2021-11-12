const fs = require('fs').promises
const { exit } = require('process')

async function asyncReadJSON(path) {
  try {
    const readFile = await fs.readFile(path)
    return JSON.parse(readFile)
  } catch (err) {
    console.log('Error loading client secret file:', err)
    exit()
  }
}

function color0to1RGBa(values: Array) {
  if(values.length === 4) {
    return {
      red: values[0], green: values[1], blue: values[2], alpha: values[3]
    }
  else if(values.length === 3) {
    return {
      red: values[0], green: values[1], blue: values[2], alpha: 1
    }
  }
}

module.exports = { asyncReadJSON, color0to1RGBa }
