const helper = require('./helper')
const axios = require('axios')
const fs = require("fs")
const rateLimit = require('axios-rate-limit')

const filename = __dirname + "\\countries\\global.txt"
const ignoredFilename = __dirname + "\\countries\\global_ignored.txt"

/* Settings start */
const requestsPerSecond = 2
const pagesPerMillionFood = 10
const pagesPerMillionClothing = 5
/* Settings end */

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
const globalLinks = require('./global_list.json').links

const http = rateLimit(axios.create(), { maxRPS: requestsPerSecond })

const getLinks = (link, round = 1) => {
  const alreadySaved = ignoredLinks.includes(link) || validLinks.includes(link) || globalLinks.includes(link)
  if (alreadySaved) return
  http.get(link, config).then(res => {
    const alreadySaved = ignoredLinks.includes(link) || validLinks.includes(link)
    if (alreadySaved) return
    const html = res.data.toString()
    const likes = helper.getNumberOfLikes(html)
    const category = helper.getCategory(html)
    if (isNaN(likes) && (!category || category.length > 50)) {
      saveIgnoredText(`${link}`)
      saveIgnoredText(`Failed to load`)
      ignoredLinks.push(link)
      return
    }
    if (likes > 10000 && helper.isCategoryAccepted(category)) {
      saveText(link)
      validLinks.push(link)
    } else {
      saveIgnoredText(`${link}`)
      if (likes <= 10000) {
        saveIgnoredText(`${likes} likes is below minimum.`)
      }
      if (!helper.isCategoryAccepted(category)) {
        saveIgnoredText(`${category} is not accepted.`)
      }
      ignoredLinks.push(link)
    }
    // TODO: Don't get links if the page has likes more than 10% of population
    const relatedLinks = helper.getPageLinks(html, link).filter(e => {
      return !validLinks.includes(e) && !ignoredLinks.includes(e)
    })
    if (relatedLinks.length > 0) {
      relatedLinks.forEach(l => getLinks(l, round + 1));
    }
  }).catch((e) => {
    const errorCode = e && e.response && e.response.status || '?'
    if (errorCode !== 500) {
      console.log(link + ` did not load (${errorCode})`)
    }
    if (!ignoredLinks.includes(link)) {
      ignoredLinks.push(link)
    }
  })
}

getLinks("https://www.facebook.com/adidas")
