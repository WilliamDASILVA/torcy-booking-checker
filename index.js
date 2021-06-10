require('dotenv').config()

const axios = require('axios')
const discord = require('discord.js')
const FormData = require('form-data')

const client = new discord.Client()

console.log('Handle ran.', process.env.DISCORD_TOKEN)

client.login(process.env.DISCORD_TOKEN)

client.once('ready', async () => {
  const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID)

  const formData = new FormData()
  formData.append('condition', 'on')
  formData.append('nextButton', 'Effectuer+une+demande+de+rendez-vous')

  axios({
    method: 'post',
    url: 'https://www.seine-et-marne.gouv.fr/booking/create/48803/0',
    headers: {
      ...formData.getHeaders(),
      'Cookie': 'eZSESSID=rhs1d5mp8v5e37md4j662bdo13'
    },
    data: formData
  })
    .then(async (response) => {
      console.log('Request sent.')
      if (response.status === 200) {
        const hasInitalForm = response.data.includes('action="/booking/create/48803/0"')
        const valid = !response.data.includes('Il n\'existe plus de plage horaire libre pour votre demande')
        console.log('Validity', hasInitalForm, valid)
        // if (!hasInitalForm && valid) {
        await channel.send('Un créneau semble disponible ! https://www.seine-et-marne.gouv.fr/booking/create/48803/2')
        await client.destroy()
        // }
        process.exit(0)
      }
    })
    .catch(err => {
      console.error('Failed', err)
      process.exit(1)
    })
})
