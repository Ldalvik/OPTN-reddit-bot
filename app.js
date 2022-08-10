import { SubmissionStream } from "snoostorm";
import Snoowrap from "snoowrap";
import { readFile } from 'fs/promises';

const credentials = JSON.parse(await readFile(new URL('./credentials.json', import.meta.url)));
const data = JSON.parse(await readFile(new URL('./data.json', import.meta.url)));
const client = new Snoowrap(credentials)

const BOT_START = Date.now() / 1000
const forzaOpenTunes = { subreddit: "ForzaOpenTunes", limit: 100, pollTime: 11000 }

new SubmissionStream(client, forzaOpenTunes).on('item', (post) => {
    let messageType = ""
    if (post.created_utc < BOT_START) return
    if (post.selftext_html.includes(data.fancyPantsTag)) {
        messageType = data.fancyPantsWarning
    } else if (post.selftext_html.includes(data.tuneFormatterTag)) {
        messageType = data.tuneFormatterText
    }
    post.reply(`${messageType}${data.staticMessage}${data.footer}`)
    console.log(post)
})