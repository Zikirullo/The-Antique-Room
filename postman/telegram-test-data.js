// Creates Telegram Login Widget data signed with your bot token, for testing
// the TELEGRAM authenticate flow in Postman without a frontend.
//
// Usage:  node postman/telegram-test-data.js [telegramId] [username]
// Paste the printed line into the Postman variable "telegramAuthData".

const { createHash, createHmac } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const env = readFileSync(join(__dirname, '..', '.env'), 'utf8');
const botToken = (env.match(/^TELEGRAM_BOT_TOKEN=(.*)$/m) || [])[1]?.trim();
if (!botToken) {
  console.error('TELEGRAM_BOT_TOKEN is missing from .env');
  process.exit(1);
}

const data = {
  id: process.argv[2] || '100200300',
  first_name: 'Test',
  username: process.argv[3] || 'antique_tester',
  auth_date: Math.floor(Date.now() / 1000).toString(),
};

const dataCheckString = Object.keys(data)
  .sort()
  .map((k) => `${k}=${data[k]}`)
  .join('\n');
const secret = createHash('sha256').update(botToken).digest();
const hash = createHmac('sha256', secret).update(dataCheckString).digest('hex');

console.log(new URLSearchParams({ ...data, hash }).toString());
