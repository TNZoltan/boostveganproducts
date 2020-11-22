const axios = require("axios")

const countries = require('./countries')

const waitTime = 1000

// Runs multiple checks for the html with a single word
const checksPass = (html, word) => {
  const wordFound = html.indexOf(word) > 0
  if (!wordFound) return false
  const wordIndex = html.indexOf(word)
  const liTagOpenIndex = html.substring(0, wordIndex).lastIndexOf('<li')
  const liTagCloseIndex = html.substring(liTagOpenIndex, html.length).indexOf('</li')
  const isComment = liTagCloseIndex < wordIndex
  if (isComment) return false
  return true
}

// Iterates through the list of words and calling checks for them
const performCheck = (html, words) => {
  for (let i = 0; i < words.length; ++i) {
    const word = words[i]
    if (checksPass(html, word)) {
      return word
    }
  }
  return false
}

// Fetches the HTML then calls all necessary checks
const fetchUrl = (url, words) => {
  return axios.get(url).then(res => {
    console.log(`Checking ${url}`)
    const html = res.data.toString()
    const globalResult = performCheck(html, ["Vegan", "vegan", "VEGAN", "plant-based", "plantbased", "Plant-based", "Plantbased"])
    if (globalResult) return globalResult
    if (words) {
      const localResult = performCheck(html, words)
      if (localResult) return localResult
    }
    return false
  })
};

const saveData = (word, url, countryName) => {
  console.log(`Word ${word} was found on ${url} from ${countryName}`)
}

const run = (countryIndex, siteIndex) => {
  if (countryIndex === countries.length) return false
  if (siteIndex === countries[countryIndex].sites.length) {
    run(countryIndex+1, 0)
    return false
  }
  setTimeout(() => {
    const url = countries[countryIndex].sites[siteIndex]
    fetchUrl(url, countries[countryIndex].words).then(word => {
      if (word) {
        saveData(word, url, countries[countryIndex].name)
      }
    })
    run(countryIndex, siteIndex + 1)
  }, waitTime)
}

run(0,0)
