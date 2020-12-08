const helper = require('./helper')
const axios = require('axios')
const fs = require("fs")

const filename = __dirname + "\\countries\\global.txt"
const ignoredFilename = __dirname + "\\countries\\global_ignored.txt"

fs.writeFile(filename, "", (err) => {
  if (err) console.log(err)
  else console.log("Main file is created")
})

fs.writeFile(ignoredFilename, "", (err) => {
  if (err) console.log(err)
  else console.log("Ignored file is created")
})

const saveText = (text, file = filename) => fs.appendFileSync(file, text + '\r\n')

const saveIgnoredText = (text) => saveText(text, ignoredFilename)

const config = {
  headers: {
    'Accept-Language': "en-US"
  }
}

let validLinks = []
let ignoredLinks = []

const getLinks = (link, round = 1) => {
  const waitTime = Math.floor(Math.random() * 5000 * Math.pow(round, 2)) + 300
  setTimeout(() => {
    // console.log('Sending request to: ' + link)
    axios.get(link, config).then(res => {
      const html = res.data.toString()
      const likes = helper.getNumberOfLikes(html)
      const category = helper.getCategory(html)
      if (isNaN(likes) && (!category || category.length > 50)) {
        saveIgnoredText(`${link}`)
        saveIgnoredText(`Failed to load`)
      } 
      if (likes > 10000 && helper.isCategoryAccepted(category)) {
        saveText(link)
        validLinks.push(link)
      } else {
        if (!ignoredLinks.includes(link)) {
          saveIgnoredText(`${link}`)
          if (likes <= 10000) saveIgnoredText(`${likes} likes is below minimum`)
          if (!helper.isCategoryAccepted(category)) saveIgnoredText(`${category} is not accepted`)
          ignoredLinks.push(link)
        }
      }
      const relatedLinks = helper.getPageLinks(html, link).filter(e => !validLinks.includes(e))
      if (relatedLinks.length > 0) {
        relatedLinks.forEach(l => getLinks(l, round + 1));
      }
    });
  }, waitTime)
}

getLinks("https://www.facebook.com/burgerking")
