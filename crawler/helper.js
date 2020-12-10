const acceptedCategories = require('./accepted_categories.json')

const {
  findAbsoluteTextAfterIndex,
  indexes,
  removeURLParameters,
  removeDuplicates,
  findTextBehindIndex
} = require('../globalHelpers')

const possibleCategoryOpenWords = [
  {
    word: 'keywords_pages',
    openOffset: 0
  },
  {
    word: "<div><a href=\"/pages/category",
    openOffset: 10
  },
  {
    word: "· <a href=\"/pages/category",
    openOffset: 0
  }
]

// Takes two words that will cut out the first combination found
// Returns the same html on failure
const componentSlicerWords = (html, openWord, closeWord) => {
  const componentOpenIndex = html.indexOf(openWord)
  if (componentOpenIndex < 0) {
    return html
  }
  const componentCloseIndex = findAbsoluteTextAfterIndex(html, componentOpenIndex, closeWord)
  return html.substring(componentOpenIndex, componentCloseIndex)
}

// Takes opening word and cuts out X offset after
// Returns the same html on failure
const componentSlicerOffset = (html, openWord, offset) => {
  const componentOpenIndex = html.indexOf(openWord)
  if (componentOpenIndex < 0) {
    return html
  }
  const componentCloseIndex = componentOpenIndex + offset
  return html.substring(componentOpenIndex, componentCloseIndex)
}

const isCategoryAccepted = (categoryText) => {
  let categoryPass = false
  acceptedCategories.forEach(category => {
    if (categoryText.indexOf(category) >= 0) {
      categoryPass = true
    }
  })
  return categoryPass
}

const getNumberOfLikes = (html, link) => {
  const component = componentSlicerOffset(html, '>Community<', 8000)
  if (component === html) {
    console.error(link + 'could not get likes')
    return false
  }
  const index = component.indexOf('like')
  const open = findTextBehindIndex(component, index, '<div')
  const close = findAbsoluteTextAfterIndex(component, index, '</div')
  const sentence = component.substring(open, close)
  return parseInt(sentence.replace(/\D/g, ""))
}

const getCategory = (html) => {
  let wordObj;
  possibleCategoryOpenWords.forEach(c => {
    if (html.indexOf(c.word) >= 0) wordObj = c
  })
  if (!wordObj) {
    console.error(link + 'could not get category')
    return ''
  }
  let component = componentSlicerOffset(html, wordObj.word, 400).substring(wordObj.openOffset)
  const open = component.indexOf('>') + 1
  const close = findAbsoluteTextAfterIndex(component, open, '<')
  const sentence = component.substring(open, close)
  return sentence.replace('amp;', '')
}

const getPageLinks = (html, link) => {
  const component = componentSlicerWords(html, 'Related Pages', '</ul')
  if (component === html) {
    console.error(link + ' could not find related pages')
    return []
  }
  const linksOpenIndices = indexes(component, 'https:')
  return removeDuplicates(
    linksOpenIndices.map(openIndex =>
      component.substring(openIndex, findAbsoluteTextAfterIndex(component, openIndex, '"') + 1)
    ).filter(str => !str.includes('scontent')).filter(str => !/\d/.test(str)).map(str => removeURLParameters(str))
  )
}

module.exports = {
  getNumberOfLikes,
  getPageLinks,
  getCategory,
  isCategoryAccepted
}