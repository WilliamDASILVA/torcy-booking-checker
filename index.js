require('dotenv').config()

const axios = require('axios')
const discord = require('discord.js')
const FormData = require('form-data')

const client = new discord.Client()

client.login(process.env.DISCORD_TOKEN)

client.once('ready', async () => {
  const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID)

  const formData = new FormData()
  formData.append('condition', 'on')
  formData.append('nextButton', 'Effectuer+une+demande+de+rendez-vous')

  axios({
    method: 'post',
    url: 'https://www.seine-et-marne.gouv.fr/booking/create/28153/0',
    headers: {
      ...formData.getHeaders(),
      'Cookie': 'eZSESSID=qgesesj4trhp67oovhmemu41b7'
    },
    data: formData
  })
    .then(async (response) => {
      console.log('Request sent.')
      if (response.status === 200) {
        const hasInitalForm = response.data.includes('action="/booking/create/28153/0"')
        const valid = !response.data.includes('Il n\'existe plus de plage horaire libre pour votre demande')
        if (!hasInitalForm && valid) {
          console.log('Available!')
          await channel.send('Un créneau semble disponible ! https://www.seine-et-marne.gouv.fr/booking/create/28153/2')
          await client.destroy()
        }
        process.exit(0)
      }
    })
    .catch(err => {
      console.error('Failed', err)
      process.exit(1)
    })
})
