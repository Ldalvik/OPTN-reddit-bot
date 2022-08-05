import { CommentStream, SubmissionStream } from "snoostorm";
import Snoowrap from "snoowrap";
import fetch from 'node-fetch';

const client = new Snoowrap({
    userAgent: "automod-OPTN-bot:v0.0.2",
    clientId: "",
    clientSecret: "",
    username: "",
    password: ""
})
const BOT_START = Date.now() / 1000

//const comments = new CommentStream(client, { subreddit: "OptnTools", limit: 2, pollTime: 1100 })
const submissions = new SubmissionStream(client, { subreddit: "ForzaOpenTunes", limit: 10, pollTime: 1150 })

const getAutoReply = async () => {
    let data = "(Empty data)"
    try {
        const response = await fetch('https://raw.githubusercontent.com/OPTN-Club/OPTN-reddit-bot/main/auto_reply_post.txt')
        if (!response.ok) {
            throw (new Error(`${response.status} (${response.statusText})`))
        }
        data = await response.text()
    } catch (error) {
        console.error(`Error in fetch: ${error.message}`)
    }
    return data
}

//comments.on('item', (item) => {
//    if (item.created_utc < BOT_START) return
//    if (item.body === "Trigger test")  
//    item.reply("")
//    console.log(item)
//})


const footer = "***\n^Visit ^https://optn.club/ ^for ^a ^tune ^formatter, ^tune ^calculator, ^and ^tuning ^guide."
const autoReply = getAutoReply()

submissions.on('item', (item) => {
    let messageType = ""
    if (item.created_utc < BOT_START) return
    if (item.selftext_html.includes("<p>[View this tune on <a href=\"https://optn.club\">optn.club</a>](<a href=\"https://optn.club/formatter\">https://optn.club/formatter</a>)</p>")) {
        messageType = "**Oh no! You posted in Fancy Pants Editor mode. To make sure your tune is formatted correctly, please edit your post and switch to Markdown mode.** \n\n"
    } else if (item.selftext_html.includes("<p><a href=\"https://optn.club/formatter\">View this tune on optn.club</a></p>")) {
        messageType = "**Thank you for using the OPTN tune formatter! Report any bugs or issues to u/03Void, u/SharpSeeer, or u/hey-im-root** \n\n"
    }

    item.reply(`${messageType}${autoReply}\n${footer}`)

    console.log(item)
})