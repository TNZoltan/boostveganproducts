const helper = require('./helper')
const axios = require('axios')
const fs = require("fs")

/* Settings start */
const countryKey = 'estonia'
const pagesPerMillion = 10
/* Settings end */

const countries = require('./countries.json')
const country = countries.find(c => c.key === countryKey)
const population = country.population

const filename = __dirname + "\\countries\\" + country.key + ".txt"
const ignoredFilename = __dirname + "\\countries\\ignored\\global.txt"

fs.writeFile(filename, "", (err) => {
  if (err) console.log(err)
  else console.log("Main file is created")
})

const saveText = (text, file = filename) => fs.appendFileSync(file, text + '\r\n')

const saveIgnoredText = (text) => saveText(text, ignoredFilename)

const config = {
  headers: {
    'accept': '*/*',
    'Accept-Language': "en-US"
  }
}

let countRequests = 0
let validLinks = []
let ignoredLinks = []
const globalLinks = require('./global_list.json')

const onErrorPage = (link) => {
  saveIgnoredText(`${link}`)
  saveIgnoredText(`Failed to load`)
  ignoredLinks.push(link)
}

const onValidPage = (link) => {
  saveText(link)
  validLinks.push(link)
}

const onNonValidPage = (link, likes, categories) => {
  saveIgnoredText(`${link}`)
  if (likes <= 10000) {
    saveIgnoredText(`${likes} likes is below minimum.`)
  }
  if (!helper.isCategoryAccepted(categories)) {
    saveIgnoredText(`${categories} are not accepted.`)
  }
  ignoredLinks.push(link)
}

const handleResult = (link, html, round) => {
  countRequests = countRequests + 1
  const alreadySaved = ignoredLinks.includes(link) || validLinks.includes(link)
  if (alreadySaved) return
  const likes = helper.getNumberOfLikes(html, link)
  const categories = helper.getCategories(html, link)
  if (isNaN(likes) || !categories) {
    onErrorPage(link)
    return
  }
  if (likes > 10000 && helper.isCategoryAccepted(categories)) {
    onValidPage(link)
  } else {
    onNonValidPage(link, likes, categories)
  }
  if (likes < population / 10) {
    const relatedLinks = helper.getPageLinks(html, link).filter(e => {
      return !validLinks.includes(e) && !ignoredLinks.includes(e)
    })
    if (relatedLinks.length > 0) {
      relatedLinks.forEach(l => getLinks(l, round + 1));
    }
  }
}

const handleError = (error, link) => {
  countRequests = countRequests + 1
  const errorCode = error && error.response && error.response.status || '?'
  if (errorCode !== 500) {
    console.log(link + ` did not load`)
    error.response && console.log(`-> HTTP error: ${errorCode}: ${error.response.data}`)
    !error.response && console.log(`-> JS error: ${error.message}`)
  }
  if (!ignoredLinks.includes(link)) {
    ignoredLinks.push(link)
  }
}

const getLinks = (link, round = 1) => {
  const alreadySaved = ignoredLinks.includes(link) || validLinks.includes(link) || globalLinks.includes(link)
  if (alreadySaved) return
  const requestLimit = Math.floor(population / 1000000 * pagesPerMillion)
  if (requestLimit < countRequests) {
    return
  }
  const waitTime = Math.floor(Math.random() * Math.pow(3, round)) + 2
  setTimeout(() => {
    axios.get(link, config)
    .then(res => handleResult(link, res.data.toString(), round))
    .catch((e) => handleError(e, link))
  }, waitTime * 1000)
}

const run = () => {
  getLinks(country.start_market)
  getLinks(country.start_fastfood)
}

run()
