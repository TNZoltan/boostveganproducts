const helper = require('./helper')
const axios = require('axios')
const fs = require("fs")

const filename = __dirname + "\\result\\global.txt"

fs.writeFile(filename, "Global List" + '\r\n', (err) => {
    if (err) console.log(err)
    else console.log("File is created")
})

const addText = (text) => fs.appendFileSync(filename, text + '\r\n')

const config = {
    headers: {
        'Accept-Language': "en-US"
    }
}

let allLinks = []

const getLinks = (link, round = 1) => {
    const waitTime = Math.floor(Math.random() * 2000 * round) + 300
    setTimeout(() => {
        axios.get(link, config).then(res => {
            addText(link)
            allLinks.push(link)
            const html = res.data.toString()
            const relatedLinks = helper.getPageLinks(html).filter(e => !allLinks.includes(e))
            if (relatedLinks.length > 0) {
                relatedLinks.forEach(l => getLinks(l, round + 1));
            }
        });
    }, waitTime)
}

getLinks("https://www.facebook.com/burgerking")
