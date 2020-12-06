const axios = require("axios")
const fs = require("fs")

const countries = require('./countries')
const {
  getFilenameDate, 
  getDate,
  removeTags,
  findTextBehindIndex,
  findTextAfterIndex,
  findAbsoluteTextAfterIndex,
  getNextWordIndex
} = require('./globalHelpers')

const waitTime = 700

const global = ["Vegan", "vegan", "VEGAN", "plant-based", "plantbased", "Plant-based", "Plantbased", "Veggie", "veggie", "VEGGIE"]

const filename = __dirname  + "\\logs\\log_" + getFilenameDate() + ".txt"

const addText = (text) => fs.appendFileSync(filename, text + '\r\n')

// Runs multiple checks for the html with a single word
const checksPass = (html, wordIndex) => {
  const tagOpeningIndex = findTextBehindIndex(html, wordIndex, '<')
  const tagClosingIndex = findTextAfterIndex(html, tagOpeningIndex, '>')
  const isTagAttribute = tagClosingIndex > wordIndex && tagOpeningIndex !== -1
  if (isTagAttribute) return false
  const liTagOpenIndex = findTextBehindIndex(html, wordIndex, '<li')
  const liTagCloseIndex = findTextAfterIndex(html, liTagOpenIndex, '</li')
  const isComment = liTagCloseIndex > wordIndex && liTagOpenIndex !== -1
  if (isComment) return false
  const scriptTagOpenIndex = findTextBehindIndex(html, wordIndex, '<script')
  const scriptTagCloseIndex = findTextAfterIndex(html, scriptTagOpenIndex, '</script>')
  const isScript = scriptTagCloseIndex > wordIndex && scriptTagOpenIndex !== -1
  if (isScript) return false
  const divTagOpenIndex = findTextBehindIndex(html, wordIndex, '<div')
  const isInBody = divTagOpenIndex < 0
  if (isInBody) return false
  // TODO Exclude posts already found last time
  return true
}

// Iterates through the list of words and calling checks for them
const performCheck = (html, words) => {
  for (let i = 0; i < words.length; ++i) {
    const word = words[i]
    let wordIndex = 0
    while (wordIndex < html.length) { 
      if (checksPass(html, wordIndex)) {
        const wordIndex = html.indexOf(word)
        const divTagOpenIndex = findTextBehindIndex(html, wordIndex, '<div')
        const divTagCloseIndex = findAbsoluteTextAfterIndex(html, divTagOpenIndex, '</div')
        return {
          word,
          paragraph: removeTags(html.substring(divTagOpenIndex, divTagCloseIndex))
        }
      }
      const newWordIndex = getNextWordIndex(html, wordIndex, word)
      if(wordIndex < newWordIndex) {
        wordIndex = newWordIndex
      } else { wordIndex = html.length }
    }
  }
  return false
}

// Fetches the HTML then calls all necessary checks
const fetchUrl = (url, words) => {
  return axios.get(url).then(res => {
    console.log(`Checking ${url}`)
    const html = res.data.toString()
    const strippedHtml = html.substring(html.indexOf('PagesProfileHomePrimaryColumnPagelet'))
    const globalResult = performCheck(strippedHtml, global)
    if (globalResult) return globalResult
    if (words) {
      const localResult = performCheck(strippedHtml, words)
      if (localResult) return localResult
    }
    return false
  })
};

const saveData = (result, url, countryName) => {
  console.log(`Word ${result.word} was found on ${url} from ${countryName}`)
  addText(' - - - - - - - - ')
  addText(`Word: ${result.word}`)
  addText(`URL: ${url} from ${countryName}`)
  addText(`"${result.paragraph}"`)
}

const run = (countryIndex, siteIndex) => {
  if (countryIndex === countries.length) return false
  if (siteIndex === countries[countryIndex].sites.length) {
    run(countryIndex+1, 0)
    return false
  }
  setTimeout(() => {
    const url = countries[countryIndex].sites[siteIndex]
    fetchUrl(url, countries[countryIndex].words).then(result => {
      if (result) {
        saveData(result, url, countries[countryIndex].name)
      }
    })
    run(countryIndex, siteIndex + 1)
  }, waitTime)
}

fs.writeFile(filename, 'Results ran at ' + getDate() + '\r\n', (err) => {
  if (err) console.log(err)
  else console.log("File is created")
})
run(0,0)
