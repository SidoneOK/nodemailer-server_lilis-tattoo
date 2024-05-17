const axios = require('axios')

module.exports = async function sendToTg(message) {
    try {
        let url = 'https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage'
        let body = {
            chat_id: process.env.TG_CHAT,
            parse_mode: 'MarkdownV2',
            text: message,
        }
        console.log('Sending request to Telegram:', JSON.stringify(body, null, 2))

        const res = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                'Access-Control-Allow-Headers':
                    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            },
        })
        console.log('Response from Telegram:', res.data)
        return res
    } catch (error) {
        if (error.response) {
            console.error('Error response data:', error.response.data)
        } else {
            console.error('Error message:', error.message)
        }
        throw error
    }
}
