module.exports = async function sendToTg(message) {
    try {
      let url = 'https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage';
      let body = JSON.stringify({
        chat_id: process.env.TG_CHAT,
        parse_mode: 'Markdown',
        text: message,
      });
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          'Access-Control-Allow-Headers':
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        },
        body,
      });
      // console.log("No problem", message, res);
      return res;
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  }