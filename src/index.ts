import { get_stock } from './page';
import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { IncomingMessage } from 'telegraf/typings/telegram-types';
import { launch, Browser } from 'puppeteer';
config();

let browser: Browser; // Browser

async function main() { // Start browser function
  browser = await launch({
    headless: false,
    args: ['--no-sandbox'],
  });
}

main(); // Starts browser

const bot = new Telegraf(process.env.BOT_TOKEN as string); // Creates 
bot.start((ctx) => ctx.reply('Welcome!')); // Reply on Start 
bot.on('text', async (ctx) => { // Reply on text
  const message = ctx.message as IncomingMessage;
  if (is_valid_url(message.text as string)) { // Is text valid url check
    const in_stock = await get_stock(browser, message.text as string); // Check if the item is in stock
    if (in_stock === undefined) ctx.reply('Something went wrong.'); // Error message
    else if (in_stock) ctx.reply('Yes, its in stock.'); // Item in stock reply
    else ctx.reply('No.'); // No item in stock reply
  }
  else {
    ctx.reply('Send me URL and I will check if the item is in stock'); // Reply on just text
  }
})

bot.launch(); // Starts telegram bot

function is_valid_url(string: string): boolean { // Checks if text is an HTML URL
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null);
};

process.on('beforeExit', async () => { // Closes the browser before exiting process
  await browser.close();
})
