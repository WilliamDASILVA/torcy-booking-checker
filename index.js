require('dotenv').config()

const axios = require('axios')
const discord = require('discord.js')
const FormData = require('form-data')

exports.handle = async function(event, context) {
  const client = new discord.Client()

  console.log('Handle ran.')

  client.login(process.env.DISCORD_TOKEN)

  return new Promise((resolve, reject) => {
    client.once('ready', async () => {
      const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID)

      const formData = new FormData()
      formData.append('condition', 'on')
      formData.append('nextButton', 'Effectuer+une+demande+de+rendez-vous')

      axios({
        method: 'post',
        url: 'https://www.seine-et-marne.gouv.fr/booking/create/48803/0',
        headers: {
          'Cookie': 'eZSESSID=plomr5vph0q3qtl22vlpuhbhs6',
          ...formData.getHeaders()
        },
        data: formData
      })
        .then((response) => {
          console.log('Request sent.')
          if (response.status === 200) {
            const hasInitalForm = response.data.includes('action="/booking/create/48803/0"')
            const valid = !response.data.includes('Il n\'existe plus de plage horaire libre pour votre demande')
            console.log('Validity', hasInitalForm, valid)
            if (!hasInitalForm && valid) {
              channel.send('Un créneau semble disponible ! https://www.seine-et-marne.gouv.fr/booking/create/48803/2')
              client.destroy()

              resolve({
                body: JSON.stringify({
                  message: 'Hello, world',
                }),
                statusCode: 200,
              })
            }
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  })
}
