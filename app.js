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
        console.log("Fancypants text detected.")
        messageType = data.fancyPantsWarning
    } else if (post.selftext_html.includes(data.tuneFormatterTag)) {
        console.log("Good tune detected.")
        messageType = data.tuneFormatterText
    }
    post.reply(`${messageType}${data.staticMessage}${data.footer}`)
    console.log(post)
})

// const getAutoReply = async () => {
//     let data = "(Empty data)"
//     try {
//         const response = await fetch('https://raw.githubusercontent.com/OPTN-Club/OPTN-reddit-bot/main/auto_reply_post.txt')
//         if (!response.ok) {
//             throw (new Error(`${response.status} (${response.statusText})`))
//         }
//         data = await response.text()
//     } catch (error) {
//         console.error(`Error in fetch: ${error.message}`)
//     }
//     return data
// }


// let savedFancyPantsPosts = ["whbc4b"]

// setInterval(() => {
//     for (let postId of savedFancyPantsPosts) {
//         const submission = client.getSubmission(postId)
//         submission.selftext_html.then(function (postBody) {
//             if (postBody !== null && submission.edited &&
//                 postBody.includes("<p><a href=\"https://optn.club/formatter\">View this tune on optn.club</a></p>")) {
//                 console.log("Fixed!")
//             } else {
//                 console.log("Unfixed.")
//             }
//         })
//     }
// }, 10000)