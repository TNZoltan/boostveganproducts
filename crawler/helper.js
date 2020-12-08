const acceptedCategories = require('./accepted_categories.json')

const {
  findAbsoluteTextAfterIndex,
  indexes,
  removeURLParameters,
  removeDuplicates,
  findTextBehindIndex
} = require('../globalHelpers')

// Takes two words that will cut out the first combination found
const componentSlicerWords = (html, openWord, closeWord) => {
  const componentOpenIndex = html.indexOf(openWord)
  if (componentOpenIndex < 0) throw new Error(`Component not found (${openWord})`)
  const componentCloseIndex = findAbsoluteTextAfterIndex(html, componentOpenIndex, closeWord)
  return html.substring(componentOpenIndex, componentCloseIndex)
}

// Takes opening word and cuts out X offset after
const componentSlicerOffset = (html, openWord, offset) => {
  const componentOpenIndex = html.indexOf(openWord)
  if (componentOpenIndex < 0) throw new Error(`Component not found (${openWord})`)
  const componentCloseIndex = componentOpenIndex + offset
  return html.substring(componentOpenIndex, componentCloseIndex)
}

const acceptedCategoryInComponent = (component) => {
  let categoryPass = false
  acceptedCategories.forEach(category => {
    if (component.indexOf(category) > 0) {
      categoryPass = true
    }
  })
  return categoryPass
}

const getNumberOfLikes = (html) => {
  const likesComponent = componentSlicerOffset(html, '>Community<', 8000)
  const likeWordIndex = likesComponent.indexOf('like')
  const likeOpen = findTextBehindIndex(likesComponent, likeWordIndex, '<div')
  const likeClose = findAbsoluteTextAfterIndex(likesComponent, likeWordIndex, '</div')
  const likeSentence = likesComponent.substring(likeOpen, likeClose)
  return parseInt(likeSentence.replace(/\D/g, ""))
}


const getPageLinks = (html) => {
  const component = componentSlicerWords(html, 'Related Pages', '</ul')
  const linksOpenIndices = indexes(component, 'https:').filter(index =>
    acceptedCategoryInComponent(
      componentSlicerWords(
        component.substring(index),
        'fcg',
        '</div'
      )
    )
  )
  return removeDuplicates(
    linksOpenIndices.map(openIndex =>
      component.substring(openIndex, findAbsoluteTextAfterIndex(component, openIndex, '"') + 1)
    ).filter(str => !str.includes('scontent')).map(str => removeURLParameters(str))
  )
}

module.exports = {
  getNumberOfLikes,
  getPageLinks
}