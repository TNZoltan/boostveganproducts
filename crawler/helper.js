const acceptedCategories = require('./accepted_categories.json')
const categories = require('./categories.json')

const {
  findAbsoluteTextAfterIndex,
  indexes,
  removeURLParameters,
  removeDuplicates,
  findTextBehindIndex,
  titleCase
} = require('../globalHelpers')

const componentSlicerWords = (html, openWord, closeWord) => {
  const componentOpenIndex = html.indexOf(openWord)
  if (componentOpenIndex < 0) {
    return html
  }
  const componentCloseIndex = findAbsoluteTextAfterIndex(html, componentOpenIndex, closeWord)
  return html.substring(componentOpenIndex, componentCloseIndex)
}

const componentSlicerOffset = (html, openWord, offset) => {
  const componentOpenIndex = html.indexOf(openWord)
  if (componentOpenIndex < 0) {
    return html
  }
  const componentCloseIndex = componentOpenIndex + offset
  return html.substring(componentOpenIndex, componentCloseIndex)
}

const isCategoryAccepted = (categoryArray) => {
  let categoryPass = false
  acceptedCategories.forEach(accepted => {
    categoryArray.forEach(category => {
      if (category === accepted) {
        categoryPass = true
      }
    })
  })
  return categoryPass
}

const getNumberOfLikes = (html, link) => {
  const component = componentSlicerOffset(html, '>Community<', 8000)
  if (component === html) {
    console.error(link + ' could not get likes')
    return false
  }
  const index = component.indexOf('like')
  const open = findTextBehindIndex(component, index, '<div')
  const close = findAbsoluteTextAfterIndex(component, index, '</div')
  const sentence = component.substring(open, close)
  return parseInt(sentence.replace(/\D/g, ""))
}

const getCategories = (html, link) => {
  const component = componentSlicerOffset(html, '>About<', 12000)
  let found = []
  categories.forEach(category => {
    if (component.indexOf(category) > 0) {
      found.push(category)
    }
    if (component.indexOf(category.toUpperCase()) > 0) {
      found.push(titleCase(category))
    }
  })
  if (found.length === 0) {
    console.error(link + ' could not get categories')
    return false
  }
  return categories
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
  getCategories,
  isCategoryAccepted
}