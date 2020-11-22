const axios = require("axios")

var pageList = require('./lists').pageList
var wordList = require('./lists').wordList

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const checksPass = (site, word) => {
  const wordFound = site.indexOf(word) > 0
  if (!wordFound) return false
  const wordIndex = site.indexOf(word)
  const liTagOpenIndex = site.substring(0, wordIndex).lastIndexOf('<li')
  const liTagCloseIndex = site.substring(liTagOpenIndex, site.length).indexOf('</li')
  const isComment = liTagCloseIndex < wordIndex
  if (isComment) return false
  return true
}

const siteHasVeganPost = (siteUrl, country) => {
  return axios.get(siteUrl).then(res => {
    const site = res.data.toString()
    for (let i = 0; i < wordList.global.length; ++i) {
      const word = wordList.global[i]
      if (checksPass(site, word)) {
        return word
      }
    }
    if (country !== 'global' && wordList[country])
      for (let i = 0; i < wordList[country].length; ++i) {
        const word = wordList[country][i]
        if (checksPass(site, word)) {
          return word
        }
      }
    return false
  })
};


for (const country in pageList) {
  for (let i = 0; i < pageList[country].length; ++i) {
    setTimeout(() => siteHasVeganPost(pageList[country][i], country).then(word => {
      if (word) console.log(`Word ${word} was found on ${pageList[country][i]} from ${capitalize(country)}`)
    }), 3000)
  }
}


